let userModel = require("../schemas/users");
let bcrypt = require('bcrypt');

module.exports = {
    CreateAnUser: async function (username, password, email, role,
        fullName, avatarUrl, status, loginCount
    ) {
        let newItem = new userModel({
            username: username,
            password: password,
            email: email,
            fullName: fullName,
            avatarUrl: avatarUrl,
            status: status,
            role: role,
            loginCount: loginCount
        });
        await newItem.save();
        return newItem;
    },
    GetAllUser: async function () {
        let users = await userModel
            .find({ isDeleted: false })
        return users;
    },
    GetAnUserByUsername: async function (username) {
        let user = await userModel
            .findOne({
                isDeleted: false,
                username: username
            })
        return user;
    },
    GetAnUserById: async function (id) {
        let user = await userModel
            .findOne({
                isDeleted: false,
                _id: id
            })
        return user;
    },
    ChangePassword: async function (userId, oldPassword, newPassword) {
        try {
            let user = await userModel.findById(userId);
            if (!user) {
                throw new Error("Không tìm thấy user");
            }
            
            // Kiểm tra mật khẩu cũ
            if (!bcrypt.compareSync(oldPassword, user.password)) {
                throw new Error("Mật khẩu cũ không chính xác");
            }
            
            // Cập nhật mật khẩu mới (sẽ được hash tự động bởi pre save hook)
            user.password = newPassword;
            await user.save();
            
            return { message: "Thay đổi mật khẩu thành công" };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
