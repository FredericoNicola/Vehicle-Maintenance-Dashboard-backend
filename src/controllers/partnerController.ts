import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import axios from "axios";

export const getPartners = async (req: Request, res: Response) => {
  const partners = await prisma.partner.findMany();
  res.json(partners);
};

export const createPartner = async (req: Request, res: Response) => {
  const { companyName, location, phoneNumber, nif } = req.body;

  // Geocode location using Nominatim
  let lat: number | undefined;
  let lng: number | undefined;
  try {
    const geoRes = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: location,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "vehicle-maintenance-dashboard/1.0",
        },
      }
    );
    if (geoRes.data && geoRes.data.length > 0) {
      lat = parseFloat(geoRes.data[0].lat);
      lng = parseFloat(geoRes.data[0].lon);
    }
  } catch (err) {
    // If geocoding fails, lat/lng remain undefined
  }

  const partner = await prisma.partner.create({
    data: { companyName, location, lat, lng, phoneNumber, nif },
  });
  res.status(201).json(partner);
};

export const deletePartner = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.partner.delete({ where: { id: Number(id) } });
  res.status(204).end();
};

export const updatePartner = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { companyName, location, phoneNumber, nif } = req.body;

  // Geocode location if changed
  let lat: number | undefined;
  let lng: number | undefined;
  if (location) {
    try {
      const geoRes = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: location,
            format: "json",
            limit: 1,
          },
          headers: {
            "User-Agent": "vehicle-maintenance-dashboard/1.0",
          },
        }
      );
      console.log("Nominatim response:", geoRes.data);
      if (geoRes.data && geoRes.data.length > 0) {
        lat = parseFloat(geoRes.data[0].lat);
        lng = parseFloat(geoRes.data[0].lon);
      }
    } catch (err) {
      console.log("Geocoding error:", err);
    }
  }

  const partner = await prisma.partner.update({
    where: { id: Number(id) },
    data: { companyName, location, phoneNumber, nif, lat, lng },
  });
  res.json(partner);
};
