"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePartner = exports.deletePartner = exports.createPartner = exports.getPartners = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const axios_1 = __importDefault(require("axios"));
const getPartners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const partners = yield prisma_1.default.partner.findMany();
    res.json(partners);
});
exports.getPartners = getPartners;
const createPartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyName, location, phoneNumber, nif } = req.body;
    // Geocode location using Nominatim
    let lat;
    let lng;
    try {
        const geoRes = yield axios_1.default.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: location,
                format: "json",
                limit: 1,
            },
            headers: {
                "User-Agent": "vehicle-maintenance-dashboard/1.0",
            },
        });
        if (geoRes.data && geoRes.data.length > 0) {
            lat = parseFloat(geoRes.data[0].lat);
            lng = parseFloat(geoRes.data[0].lon);
        }
    }
    catch (err) {
        // If geocoding fails, lat/lng remain undefined
    }
    const partner = yield prisma_1.default.partner.create({
        data: { companyName, location, lat, lng, phoneNumber, nif },
    });
    res.status(201).json(partner);
});
exports.createPartner = createPartner;
const deletePartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.partner.delete({ where: { id: Number(id) } });
    res.status(204).end();
});
exports.deletePartner = deletePartner;
const updatePartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { companyName, location, phoneNumber, nif } = req.body;
    // Geocode location if changed
    let lat;
    let lng;
    if (location) {
        try {
            const geoRes = yield axios_1.default.get("https://nominatim.openstreetmap.org/search", {
                params: {
                    q: location,
                    format: "json",
                    limit: 1,
                },
                headers: {
                    "User-Agent": "vehicle-maintenance-dashboard/1.0",
                },
            });
            console.log("Nominatim response:", geoRes.data);
            if (geoRes.data && geoRes.data.length > 0) {
                lat = parseFloat(geoRes.data[0].lat);
                lng = parseFloat(geoRes.data[0].lon);
            }
        }
        catch (err) {
            console.log("Geocoding error:", err);
        }
    }
    const partner = yield prisma_1.default.partner.update({
        where: { id: Number(id) },
        data: { companyName, location, phoneNumber, nif, lat, lng },
    });
    res.json(partner);
});
exports.updatePartner = updatePartner;
