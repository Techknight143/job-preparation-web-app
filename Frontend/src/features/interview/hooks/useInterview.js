import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { generateInterviewReport, getAllInteviewReports, getInterviewReportById, generateResumePdf } from "../services/interview.api";
import { useParams } from "react-router";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const {interviewId} = useParams();
    const {loading,setLoading,report,setReport,reports,setReports} = context;

    const generateReport = async({jobDescription,selfDescription,resumeFile})=> {
        let response = null;
        try{
            setLoading(true);
             response = await generateInterviewReport({jobDescription,selfDescription,resumeFile});
            setReport(response.interviewReport);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
        return response.interviewReport;
    }

    const getReportById = async (interviewId) => {
        let response = null;
         try{
            setLoading(true);
             response = await getInterviewReportById({interviewId});
            setReport(response.interviewReport);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
        return response.interviewReport;
    }

    const getReports = async() => {
        let response = null;
         try{
            setLoading(true);
            response = await getAllInteviewReports();
            setReports(response.interviewReports);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
        return response.interviewReports;
    }

    const getResumePdf = async({interviewReportId}) => {
        try {
            setLoading(true)
            const response = await generateResumePdf({ interviewReportId });
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `resume_${interviewReportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if(interviewId){
            getReportById(interviewId);
        }else{
            getReports();
        }
    }, [interviewId]);

    return {loading,report,reports,generateReport,getReportById,getReports,getResumePdf}
}