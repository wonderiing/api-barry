import { Router } from "express";
import CryptoInvestments from "../models/cryptoInvestment.js";
import Crypto from "../models/crypto.js";

const router = Router();

const getCryptoInvestmentById = async (id) => {
    const cryptoInvestment = await CryptoInvestments.findByPk(id);
    if (!cryptoInvestment) {
        throw new Error("La inversión no se encontró");
    }
    return cryptoInvestment;
};

router.get("/", async (req, res) => {
    try {
        const investments = await CryptoInvestments.findAll({
            include: [
                {
                    model: Crypto,
                    attributes: ["name", "symbol"]
                }
            ]
        });
        res.json(investments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const investment = await CryptoInvestments.findOne({
            where: {id: req.params.id},
            include: {model: Crypto, attributes: ["name", "symbol"]}
    
        })
        res.json(investment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { userId, cryptoId, amount, currency } = req.body;

        const existingInvestment = await CryptoInvestments.findOne({
            where: { userId, cryptoId, currency }
        });

        if (existingInvestment) {
            return res.status(400).json({ error: "Ya existe una inversión con esos valores." });
        }

        const newInvestment = await CryptoInvestments.create({
            userId,
            cryptoId,
            amount,
            currency
        });

        res.status(201).json(newInvestment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const investment = await getCryptoInvestmentById(req.params.id);
        const { amount, currency } = req.body;

        investment.amount = amount;
        investment.currency = currency;
        await investment.save();

        res.json(investment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const investment = await getCryptoInvestmentById(req.params.id);
        await investment.destroy();
        res.json({ message: "Inversión eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
