const testUser = (req,res) => {
    res.status(200).send({
        success: true,
        message: "Test User"
    })
};

module.exports = {testUser}