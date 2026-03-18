const mongoose = require('mongoose');
const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const roleModel = mongoose.model('role', roleSchema);

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/NNPTUD-S4');
        console.log('✓ Connected to MongoDB');

        // Check if roles already exist
        const roleCount = await roleModel.countDocuments();
        if (roleCount > 0) {
            console.log('✓ Roles already exist. Skipping seed.');
            process.exit(0);
        }

        // Create default roles
        const roles = [
            {
                name: 'Admin',
                description: 'Người quản trị hệ thống'
            },
            {
                name: 'User',
                description: 'Người dùng thường'
            },
            {
                name: 'Manager',
                description: 'Quản lý sản phẩm'
            }
        ];

        const createdRoles = await roleModel.insertMany(roles);
        console.log('✓ Created roles:');
        createdRoles.forEach(role => {
            console.log(`  - ${role.name}: ${role._id}`);
        });

        // Get the User role ID for default registration
        const userRole = await roleModel.findOne({ name: 'User' });
        console.log(`\n✓ Use this ID for default registration role:`);
        console.log(`  ${userRole._id}`);

        mongoose.connection.close();
        console.log('\n✓ Database seed completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
}

seedDatabase();
