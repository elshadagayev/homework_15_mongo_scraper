class JSONResp {
    getErrorResponse (statusCode, message) {
        return {
            statusCode,
            message,
            body: []
        }
    }

    getSuccessResponse (body) {
        return {
            statusCode: 200,
            message: "",
            body
        }
    }
}

module.exports = JSONResp;