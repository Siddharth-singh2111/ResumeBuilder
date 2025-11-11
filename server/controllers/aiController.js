

// controller for enhancing a resume's professional summary using AI
// POST: /api/ai/enhance-pro-sum

import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";


export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;
        if (!userContent) {
            return res.status(400).json({ message: "User content is required" });
        }
        const response = await ai.chat.completions.create({
            model: process.env.OPENAPI_MODEL_NAME,
            messages: [
                { "role": "system", "content": "You are an expert in resume writing. Your task is to enhance the prodessional summary of resumes to make them more appealing to employers.The summary should be concise, impactful, and highlight key skills and achievements.Make it compelling to read.ATS friendly language and only return text no options or additional info." },
                {
                    "role": "user",
                    "content": userContent,
                }
            ]
        });
        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// controller for enhancing a resumes job descriptions using AI
// POST: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;
        if (!userContent) {
            return res.status(400).json({ message: "User content is required" });
        }
        const response = await ai.chat.completions.create({
            model: process.env.OPENAPI_MODEL_NAME,
            messages: [
                { "role": "system", "content": "You are an expert in resume writing. Your task is to enhance the job descriptions of resumes to make them more appealing to employers.The descriptions should be concise, impactful, and highlight key skills and achievements related to the job.Make it compelling to read.ATS friendly language and only return text no options or additional info." },

                {
                    "role": "user",
                    "content": userContent,
                }
            ]
        });
        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}


//controller for uploading a resume to database
// POST: /api/ai/upload-resume

export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;
        if (!resumeText) {
            return res.status(400).json({ message: "Resume text is required" });
        }
        const systemPrompt = "You are an expert in resume parsing.Your task is to extract relevant sections from resumes such as personal info,professional summary,skills,experience,education and format them into a JSON object suitable for database storage.";
        const userPrompt = `Here is the resume text:\n${resumeText}Provide data in the following JSON Format with no additional  text before or after:
        {
        professional_summary:{type:String,default:""},
    skills:[{type:String}],
    personal_info:{
        image:{type:String,default:""},
        full_name:{type:String,default:""},
        professsion:{type:String,default:""},
        email:{type:String,default:""},
        phone:{type:String,default:""},
        location:{type:String,default:""},
        linkedin:{type:String,default:""},
        website:{type:String,default:""},
    },
    experience:[{
        company:{type:String},
        position:{type:String},
        start_date:{type:String},
        end_date:{type:String},
        description:{type:String},
        is_current:{type:Boolean},
        projects:[{
            name:{type:String},
            type:{type:String,enum:["personal","academic","professional"]},
            description:{type:String},
           
        }]
    }],
    education:[{
        institution:{type:String},
        degree:{type:String},
        field:{type:String},
        graduation_date:{type:String},
        gpa:{type:String},
    }],
        }
        \nExtract the relevant sections and format them into a JSON object. Ensure that the JSON structure aligns with the database schema for resumes. Only provide the JSON object as output without any additional text or explanation.`;
        const response = await ai.chat.completions.create({
            model: process.env.OPENAPI_MODEL_NAME,
            messages: [
                {
                    "role": "system",
                    "content": systemPrompt
                },
                { "role": "user", "content": userPrompt }
            ],
            response_format: { type: 'json_object' }
        });
        const extracedData = response.choices[0].message.content;
        const parsedData = JSON.parse(extracedData);
        const newResume = await Resume.create({
            userId,
            title,
            ...parsedData

        })
        res.json({ resumeId: newResume._id });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}