const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    student :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student',
        require:true
    },
    theorySubjectFeedbacks : [{
        teacher : {
            type : String , 
        },
        subject : {
            type : String 
        },        
        theorySubjectFeedback : {
            subjectCoverage : {
                type:Number,
            },
            lectureOrganization : {
                type:Number,
            },
            communicationSkill : {
                type:Number,
            },
            assignmentTutorialQuality : {
                type:Number,
            },
            uniformity : {
                type:Number,
            },
            illustrations: {
                type:Number,
                require:true
            },
            voiceClarity : {
                type:Number,
            },
            accessibilityDoubtClarification : {
                type:Number,
            },
            answerSheetDiscussion :{
                type:Number,
            },
        },
    }],
    labFeedbacks : [{
        labTeacher : {
            type : String , 
        },
        labSubject : {
            type : String 
        },
        labFeedback : {
            expirementCoverage : {
                type:Number,
            },
            experiementPreparation : {
                type:Number,
            },
            solvingQueries : {
                type:Number,
            },
            experimentQuality : {
                type:Number,
            },
            uniformity: {
                type:Number,
            },
        } ,
    }],
    labAssistantFeedbacks : [{
        labAssistant : {
            type : String , 
        },
        labSubject : {
            type : String
        }, 
        labAssistantFeedback : {
            availability : {
                type:Number,
            },
            assistance : {
                type:Number,
            },
            involvement : {
                type:Number,
            },
            solvingQueries : {
                type:Number,
            },
            labFacility : {
                type:Number,
            },
        }
    }],
});

module.exports = mongoose.model("Feedback", feedbackSchema);