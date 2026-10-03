const mongoose = require('mongoose');









/**
 * - job description schema - String
 * - resume text - String
 * - Self description - String
 * 
 * -matchScore - Number
 * 
 * Technical Questions :
 *  [{
 *      question : "",
 *      intention : "",
 *      answer : "",
 *  
 *    }
 *  ]
 * 
 * Behavioral Questions : 
 * [{
 *      question : "",
 *      intention : "",
 *      answer : "",
 *  
 *    }
 *  ]
 * 
 * Skill Gap :
* [{
*      skills : "",
*      severity : {
*          type : String,
*          enum : ["Low", "Medium", "High"]
*      }
*  
*    }
*  ]
 * 
 * 
 * Preparation Plan : 
 * [{
 *      day : Number,
 *     focus : String,
 *      tasks : [String]
 *  
 *    }
 *  ]
 */
const technicalQuestionSchema = new mongoose.Schema({
    question : {
        type : String,
        required : [true, "Question is required"]
    },
    intention : {
        type : String,
        required : [true, "Intention is required"]
    },
    answer : {
        type : String,
        required : [true, "Answer is required"]
    }
}, {_id: false});

const behavioralQuestionSchema = new mongoose.Schema({
    question : {
        type : String,
        required : [true, "Question is required"]
    },
    intention : {
        type : String,
        required : [true, "Intention is required"]
    },
    answer : {
        type : String,
        required : [true, "Answer is required"]
    }
}, {_id : false});

const skillGapSchema = new mongoose.Schema({
    skill : {
        type : String,
        required : [true, "Skill is required"]
    },
    severity : {
        type : String,
        enum : ["low", "medium" , "high"],
        required : [true,"Severity is required"]
    }
}, {_id : false})

const preparationPlanSchema = new mongoose.Schema({
    day : {
        type : Number,
        required : [true, "Day is required"]
    },
    focus : {
        type : String,
        required : [true, "focus is required"]
    },
    tasks : [{
        type : String,
        required : [true,"task is required"]
    }],
},{_id : false})

const InterviewReportSchema = new mongoose.Schema({
    jobDescription : {
        type : String,
        required : [true, "Job description is required"]
    },
    resumeText : {
        type : String,
    },
    selfDescription : {
        type : String,
    },
    matchScore : {
        type : Number,
        min : 0,
        max : 100
    },
    technicalQuestions : [technicalQuestionSchema],
    behavioralQuestions : [behavioralQuestionSchema],
    skillGap : [skillGapSchema],
    preparationPlan : [preparationPlanSchema],
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    title : {
        type: String,
        required: [true, "Job title is required"]
    }
})

module.exports = mongoose.model("interviewReportModel",InterviewReportSchema)