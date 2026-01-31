exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/javascript',
            'Access-Control-Allow-Origin': '*'
        },
        body: `window.CONFIG = {
    GIST_ID: "${process.env.GIST_ID}",
    GITHUB_TOKEN: "${process.env.GITHUB_TOKEN}"
};`
    };
};
