import mongoose from 'mongoose'


const MigrationSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true
	}

}, { timestamps: true })

export default mongoose.model('Migrations', MigrationSchema)
