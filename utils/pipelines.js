const pipelines={
    attendancePipeline: (studentId)=>{
        return [
            { $match: { student: studentId } }, 
            { $lookup: { from: "subjects", localField: "subject", foreignField: "_id", as: "subjectDetails" } },
            { $unwind: "$subjectDetails" },
            { $sort: { date: 1 } },
            { $group: 
              { _id: "$subjectDetails", 
                totalClasses: { $sum: 1 }, 
                totalPresent: { 
                  $sum: { 
                    $cond: { 
                      if: { $or: [ "$attended", "$isAc" ] }, 
                      then: 1, 
                      else: 0 
                    }
                  }
                },
                attendance: { $push: {date:"$date", attended:"$attended", isAc:"isAc"} } 
              } 
            }, 
            {
              $project:{
                subject: "$_id.name", 
                attendance: 1,
                totalClasses: 1,
                totalPresent: 1,
                _id: 0
              }
            },
            { $sort: { subject: 1 } }
          ]
    },
    pdpAttendancePipeline: (studentId)=>{
        return [
            { $match: { student: studentId } }, 
            { $sort: { date: 1 } },
            { $group: 
              { _id: null, 
                totalClasses: { $sum: 1 }, 
                totalPresent: { 
                  $sum: { 
                    $cond: { 
                      if: { $or: [ "$attended", "$isAc" ] }, 
                      then: 1, 
                      else: 0 
                    }
                  }
                },
                attendance: { $push: {date:"$date",attended:"$attended",isAc:"$isAc"} } 
              } 
            }, 
            {
              $project:{ 
                _id: 0,
                attendance: 1,
                totalClasses: 1,
                totalPresent: 1
              }
            }
          ]
    },
    resultPipeline: (studentId)=>{
        return [
            {$match: {student: studentId}},
            {$lookup: { from: "subjects", localField: "subject", foreignField: "_id", as: "subjectDetails" }},
            {$lookup: { from: "exams", localField: "exam", foreignField: "_id", as: "examDetails" }},
            {$unwind: "$subjectDetails"},
            {$unwind: "$examDetails"},
            {$group: {
              _id: "$examDetails",
              result: {$push: {subject: "$subjectDetails.name", maximumMarks:"$maximumMarks", marksObtained:"$marksObtained"}}
            }},
            {$project:{
              exam:"$_id.examName",
              result: 1,
              _id: 0
            }}
          ]
    }
}

module.exports=pipelines