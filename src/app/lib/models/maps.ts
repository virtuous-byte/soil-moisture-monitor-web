import { Schema, model, models } from "mongoose";

interface IMaps {
    fileName: string;
    etag: string;
}

const mapsSchema = new Schema<IMaps>({
    fileName: {
        type: String,
        required: true
    },
    etag: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Maps = models.Maps || model('Maps', mapsSchema);  

export default Maps;