import { Schema, model, models } from "mongoose";

interface ILogs {
    sensors: number[]
}

const logsSchema = new Schema<ILogs>({
    sensors: {
        type: [Number],
        required: true
    }
}, {
    timestamps: true
});

const Logs = models.Logs || model('Logs', logsSchema);  

export default Logs;