export default {
    dbURL: process.env.MONGO_URL || 'mongodb+srv://liorlazar3_db_user:U7yDHyqvPT8Q7ZIc@taskrail.rnr7fmc.mongodb.net/taskrail_db?retryWrites=true&w=majority',
    dbName: process.env.DB_NAME || 'taskrail_db'
}