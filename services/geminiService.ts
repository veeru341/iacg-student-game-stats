import { GoogleGenAI } from "@google/genai";
import { Student } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generatePerformanceSummary = async (student: Student): Promise<string> => {
    try {
        const skills = {
            Speed: student.lpi.speed,
            Memory: student.lpi.memory,
            Attention: student.lpi.attention,
            Flexibility: student.lpi.flexibility,
            "Problem Solving": student.lpi.problemSolving,
            Math: student.lpi.math,
        };

        const filteredSkills = Object.entries(skills).filter(([, score]) => score > 0);

        if (filteredSkills.length === 0) {
            return "This player is just getting started! Play some games to see a performance summary.";
        }
        
        const sortedSkills = filteredSkills.sort((a, b) => b[1] - a[1]);
        
        const strongestSkill = sortedSkills[0];
        const weakestSkill = sortedSkills[sortedSkills.length - 1];

        const prompt = `
            You are a helpful and encouraging gaming coach. Based on the following player statistics, write a 3-sentence performance summary in a single paragraph.
            First, praise their strongest skill.
            Second, gently point out their weakest skill as an area for improvement.
            Finally, offer a brief, encouraging tip related to their weakest skill.

            Player Name: ${student.name}
            Overall LPI: ${student.lpi.overall}
            ---
            Skill Scores (LPI):
            Strongest Skill: ${strongestSkill[0]} (${strongestSkill[1]})
            Weakest Skill: ${weakestSkill[0]} (${weakestSkill[1]})
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.7,
                topP: 1,
                topK: 1,
            }
        });
        
        return response.text;

    } catch (error) {
        console.error("Error generating performance summary:", error);
        return "Could not generate AI summary at this time. Please try again later.";
    }
};