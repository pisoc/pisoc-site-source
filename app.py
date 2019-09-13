"""Serves and automatically updates the pisoc website"""
import hashlib
import hmac
import logging
import os
import subprocess

import flask
import werkzeug

app = flask.Flask(__name__)
app.config['STATIC_FOLDER'] = 'hugo/public'
app.logger = logging.getLogger('gunicorn.error')
app.logger.setLevel(logging.INFO)


def serve_from_public(path_to_resource):
    """Serves from the "public" directory generated by hugo
    Code dervied from:
    https://github.com/pallets/flask/blob/master/flask/helpers.py#L681
    """
    filename = flask.helpers.safe_join('hugo/public', path_to_resource)

    if not os.path.isabs(filename):
        filename = os.path.join(flask.current_app.root_path, filename)

    try:
        # Linked to a resource
        if os.path.isfile(filename):
            return flask.helpers.send_file(filename, conditional=True)

        # Linked to a directory, serve the index for that dir
        if os.path.isdir(filename):
            return flask.helpers.send_file(filename + '/index.html', conditional=True)

        raise werkzeug.exceptions.NotFound()
    except (TypeError, ValueError):
        raise werkzeug.exceptions.BadRequest()


def pretty_log_stdout(stdout):
    """Logs a blob of text (proc stdouts) line-by-line"""
    for line in stdout.split('\n'):
        if line:
            app.logger.info(line)


def verify_webhook(request):
    """Verifies the webhook content hasn't been tampered with, and is sent by GitHub:
    https://developer.github.com/webhooks/securing/#validating-payloads-from-github
    """
    predicted = 'sha1=' + hmac.new(
        os.getenv('PISOCNET_REBUILD_SECRET').encode(),
        request.get_data(),
        hashlib.sha1
    ).hexdigest()

    received = request.headers['X-Hub-Signature']

    app.logger.info(f'Predicted: {predicted}')
    app.logger.info(f'Received:  {received}')
    return hmac.compare_digest(predicted, received)

@app.route('/')
def index():
    """Serves the index page"""
    return serve_from_public('index.html')


@app.route('/<path:path_to_resource>')
def other_resources(path_to_resource):
    """Serves all resources that are not /index.html"""
    return serve_from_public(path_to_resource)


@app.route('/' + os.getenv('PISOCNET_REBUILD_ENDPOINT'), methods=['POST'])
def rebuild():
    """Listens for payloads sent by Github's webhook system.
    Verifies the X-Hub-Signature header, as documented here:
    https://developer.github.com/webhooks/#delivery-headers

    If verification succeeds, the new version of the site is pulled from
    GitHub, and built with hugo.
    """

    matching = verify_webhook(flask.request)

    if not matching:
        app.logger.warning('Could not verify webhook. Aborting!')
        return ''

    app.logger.info('Verified webhook')

    ref = flask.request.get_json().get('ref')

    if ref is None or not ref.endswith('master'):
        app.logger.info('Push wasn\'t made to master')
        return ''

    # XXX: A pull taking too long here might cause issues
    app.logger.info('Push made to master')
    options = {
        'stdout': subprocess.PIPE,
        'stderr': subprocess.STDOUT,
        'universal_newlines': True
    }

    # Pull changes and new submodule "pointer"
    app.logger.info('Pulling from git:')
    pretty_log_stdout(subprocess.run(
        'git pull --recurse-submodules=yes'.split(),
        **options
    ).stdout)

    # Pull from new submodule "pointer"
    app.logger.info('Updating submodules:')
    pretty_log_stdout(subprocess.run(
        'git submodule update --init --recursive'.split(),
        **options
    ).stdout)

    # BUG: Raw hugo stdout still making it to logs
    # [74B blob data], etc
    app.logger.info('Rebuilding site:')
    pretty_log_stdout(subprocess.run(
        'hugo --cleanDestinationDir -s hugo/'.split(),
        **options
    ).stdout)

    return ''


@app.errorhandler(404)
def page_not_found(_):
    """Serve 404.html when a 404 happens"""
    return serve_from_public('404.html'), 404

@app.errorhandler(500)
def internal_server_error(_):
    """Serve 500.html when a 500 happens"""
    return serve_from_public('500.html'), 404
