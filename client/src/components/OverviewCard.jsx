import { motion } from "framer-motion";
import React from "react";

const OverviewCard = (Data) => {
    const Icon = Data.icon;
    return (
        <motion.div
        whileHover={{y:-7}}
        transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition border-l-4 flex items-center gap-4 border-l-[var(--Hover-Color)] cursor-default"
        >
            <div className="p-3 rounded-lg bg-[var(--Hover-BG-Tint)]">
                <Icon className={`h-6 w-6 text-[var(--Hover-Color)] ${Data.color}`} />
            </div>
            <div>
                <h2 className="text-gray-500 text-sm">{Data.title}</h2>
                <p className={`text-2xl font-bold mt-1 text-[var(--Hover-Color)] ${Data.color}`}>
                    {Data.value}
                </p>
            </div>
        </motion.div>
    );
}

export default OverviewCard;