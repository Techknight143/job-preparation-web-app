const {GoogleGenAI} =  require('@google/genai');
const {z} = require('zod');
const puppeteer = require('puppeteer');

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_GENAI_API_KEY});
const GEMINI_MODEL = process.env.GEMINI_MODEL;


const interviewReportSchema = z.object({
    matchScore: z.number().describe("The overall match score number between 0 to 100 if the student matches with the job"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that can be asked during the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this technical questions"),
        answer: z.string().describe("How to answer this technical questions, what points to be covered in the answer, what are the common mistakes to be avoided while answering this technical questions"),
    })).describe("The technical questions can be asked during the interview, their intention and how to answer them"),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question that can be asked during the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this behavioral questions"),
        answer: z.string().describe("How to answer this behavioral questions, what points to be covered in the answer, what are the common mistakes to be avoided while answering this behavioral questions"),
    })).describe("The behavioral questions can be asked during the interview, their intention and how to answer them"),

    skillGap: z.array(z.object({
        skill: z.string().describe("The skill gap identified during the interview"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap identified during the interview"),
    })).describe("The skill gaps identified during the interview and their severity"),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day of the preparation plan"),
        focus: z.string().describe("The main focus of the preparation plan for that day"),
        tasks: z.array(z.string()).describe("The List of tasks to be completed for that day's preparation plan"),
    })).describe("The preparation plan for the interview, including the day, focus and tasks to be completed"),

    title: z.string().describe("The title of the job for which the interview report is generated")

})

async function generateInterviewReport({jobDescription, resumeText, selfDescription}) {
    const prompt = `Generate an interview report based on the following information:
                    Job Description: ${jobDescription}
                    Resume Text: ${resumeText}
                    Self Description: ${selfDescription} 
                    Analyze the candidate carefully and generate:
                    1. An overall match score from 0 to 100.
                    2. Technical interview questions with interviewer intention and answer guidance.
                    3. Behavioral interview questions with interviewer intention and answer guidance.
                    4. Skill gaps with severity.
                    5. A practical day-by-day preparation plan.
    `;
    console.log("Calling gemini.......");

    const retries = 4;
    let response;
    for(let attempt=1; attempt<=retries; attempt++){
        try{
            console.log(
                `Gemini request - attempt ${attempt}/${retries}`
            );
             response = await ai.models.generateContent({
                model: GEMINI_MODEL,
                contents: prompt,
                config: {   
                    responseMimeType: "application/json",
                    responseJsonSchema: z.toJSONSchema(interviewReportSchema)
                }
            })
            //gemini succeded
            break;

        } catch (error) {

            const status = error?.status || error?.code;

            console.log(
                `Gemini request failed with status: ${status}`
            );

            // Don't retry non-temporary errors
            if (status !== 503 && status !== 429) {
                throw error;
            }

            // Last attempt
            if (attempt === retries) {
                console.log(
                    "Gemini failed after all retries"
                );

                throw error;
            }

            // 1s, 2s, 4s, 8s
            const delay = Math.pow(2, attempt - 1) * 1000;

            // Random jitter between 0-500ms
            const jitter = Math.random() * 500;

            const totalDelay = delay + jitter;

            console.log(
                `Gemini returned ${status}. ` +
                `Retrying in ${Math.round(totalDelay)}ms...`
            );

            await new Promise(resolve =>
                setTimeout(resolve, totalDelay)
            );
        }
    }
    if (!response?.text) {
        throw new Error("Gemini returned an empty response");
    }
    
   try {
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Invalid Gemini JSON:", response.text);
        throw new Error("Gemini returned invalid JSON");
    }
}


async function generateHtmlToPdf(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent,{waitUntil : "networkidle0"});
    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });
    await browser.close();
    return pdfBuffer;

}



async function generateResumePdf({
    resumeText,
    jobDescription,
    selfDescription
}) {

    const resumePdfSchema = z.object({
        html: z.string().describe(
            "The HTML content of the resume which can be converted to PDF using Puppeteer"
        )
    });

    const prompt = `
        Generate resume for a candidate with the following details:

        Resume:
        ${resumeText}

        Self Description:
        ${selfDescription}

        Job Description:
        ${jobDescription}

        The response should be a JSON object with a single field "html"
        containing the HTML content of the resume.

        Requirements:
        - Tailor the resume to the given job description.
        - Highlight relevant skills, experience and projects.
        - Keep the content natural and professional.
        - Do not invent skills, experience, projects or achievements.
        - Make the resume ATS friendly.
        - Use a simple and professional design.
        - Keep it within 1-2 pages.
        - The HTML should work with Puppeteer.
    `;

    const retries = 4;

    let response;

    for (let attempt = 1; attempt <= retries; attempt++) {

        try {

            console.log(
                `Gemini request - attempt ${attempt}/${retries}`
            );

            response = await ai.models.generateContent({
                model: GEMINI_MODEL,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseJsonSchema:
                        z.toJSONSchema(resumePdfSchema)
                }
            });

            // Gemini succeeded
            break;

        } catch (error) {

            const status = error?.status || error?.code;

            console.log(
                `Gemini request failed with status: ${status}`
            );

            // Don't retry non-temporary errors
            if (status !== 503 && status !== 429) {
                throw error;
            }

            // Last attempt
            if (attempt === retries) {
                console.log(
                    "Gemini failed after all retries"
                );

                throw error;
            }

            // 1s, 2s, 4s, 8s
            const delay = Math.pow(2, attempt - 1) * 1000;

            // Random jitter between 0-500ms
            const jitter = Math.random() * 500;

            const totalDelay = delay + jitter;

            console.log(
                `Gemini returned ${status}. ` +
                `Retrying in ${Math.round(totalDelay)}ms...`
            );

            await new Promise(resolve =>
                setTimeout(resolve, totalDelay)
            );
        }
    }

    // Gemini should have returned a response
    if (!response) {
        throw new Error("Gemini did not return a response");
    }

    // Parse Gemini response
    const jsonContent = JSON.parse(response.text);

    // Generate PDF separately
    const pdfBuffer = await generateHtmlToPdf(
        jsonContent.html
    );

    return pdfBuffer;
}




module.exports = { generateInterviewReport, generateResumePdf }