const { generateInterviewReport, generateResumePdf } = require("../service/ai.service");
const interviewReportModel = require("../model/interviewReport.model");
const { PDFParse } = require("pdf-parse");

/**
 * @description Generate the interview report
 */
const generateInterviewReportController = async (req, res) => {
  try {
    const parser = new PDFParse({ data: req.file.buffer });
    const resumeContent = await parser.getText();
    await parser.destroy();

    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReport({
      resumeText: resumeContent.text,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resumeText: resumeContent.text,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    });

    res.status(201).json({
      message: "Interview Report is generated successfully!!!",
      interviewReport,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error generating interview report" });
  }
};

/**
 * @description Get the interview report by the id
 */
const getInterviewReportById = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    res.status(200).json({
      message: "Interview report fetched successfully.",
      interviewReport,
    });
  } catch (error) {
    console.log("Error in getting the report", error);
    res.status(500).json({
      message: "Could not fetch the interview report",
    });
  }
};

/**
 * @description get all the interview report for the logged in user
 */

const getAllInterviewReportsController = async(req,res) => {
    const interviewReports = await interviewReportModel.find({user: req.user.id}).sort({createdAt : -1}).select("-resume -selfDescription -jobDescription -technicalQuestions -_v -skillGaps -preparationPlan")

    res.status(200).json({
        message : "All interview reports fetched successfully",
        interviewReports : interviewReports
    })
}

/**
 * @description Controller for generating the resume pdf
 */
const generateResumePdfController = async(req,res) => {
  const {interviewReportId} = req.params;

  const interviewReport = await interviewReportModel.findById(interviewReportId);

  if(!interviewReport){
    return res.status(404).json({
      message: "Interview Report not found!!!"
    });
  }

  const {resumeText,jobDescription,selfDescription} = interviewReport;

  const pdfBuffer = await generateResumePdf({resumeText,jobDescription,selfDescription});

  res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    });

    res.send(pdfBuffer);
}

module.exports = { generateInterviewReportController , getInterviewReportById , getAllInterviewReportsController, generateResumePdfController };
