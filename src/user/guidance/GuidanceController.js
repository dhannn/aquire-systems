import { AdmissionRecord } from "../../schema/admissionrecord.js";
import { SchoolHistory } from "../../schema/schoolhistory.js";
import { UserController } from "../UserController.js";
import { GuidanceModel } from "./GuidanceModel.js";
import { FamilyData } from "../../schema/familydata.js";
import { SchoolActivity } from "../../schema/schoolactivity.js";
import { AbilityIntelligenceTest } from "../../schema/abilityintelligencetest.js";

export class GuidanceController extends UserController {
    startingRoute = '/guidance';
    allowedUserType = 'G';

    initializeRoutes() {

        this.createRoute('GET', '/', this.viewGuidancePage);
        this.createRoute('POST', '/', this.getStudentRecords);
        this.createRoute('GET', '/records', this.viewGuidancePage)
        this.createRoute('POST', '/records', this.addStudentRecord);
        this.createRoute('GET', '/cummulative', this.viewGuidancePage);
        this.createRoute('POST', '/cummulative', this.updateStudentCummulativeRecord);
        this.createRoute('POST', '/cummulative-get', this.getStudentCummulativeRecord);

    }

    /**
     * uses Admin model to add student records into the database
     * @param {Request} req 
     * @param {Response} res 
     */
    async addStudentRecord(req, res) {
        try {
            const {student_id, recordTypes} = req.body;
            console.log(recordTypes);
            const result = await GuidanceModel.addStudentRecord(student_id, recordTypes);
            const studentRecords = await GuidanceModel.StudentRecords();
            if(result.error){
                res.render('Guidance', {message: {content: 'Error adding Record'}, studentRecords: studentRecords});
            } else {
                res.render('Guidance', {message: { isSuccess: true, content: 'Student Record added successfully!'}, studentRecords: studentRecords});
                console.log('Record Added');
            }
        } catch (error) {
            const studentRecords = await GuidanceModel.StudentRecords();
            res.render('Guidance', {message: {content: 'Error adding Record'}, studentRecords: studentRecords});
        }
    }

    /**
     * Creates the view for the guidance student records and initializes all record types
     * @param {Request} _ 
     * @param {Response} res 
     */
    async viewGuidancePage(_, res) {
        GuidanceModel.initializeRecordTypes();
        const allowed = await UserController.verifyUserPermission(this.allowedUserType, _)
        const loggedIn = UserController.checkifloggedIn(_);

        const studentRecords = await GuidanceModel.StudentRecords();
        if (loggedIn) {
            if (allowed) {
                res.render('Guidance', {studentRecords: studentRecords});
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }  
    }

    async getStudentRecords(req, res) {
        const studentId = req.body.textData;
        try {
            // Query the database to find records for the student
            const records = await AdmissionRecord.findAll({
                where: { student_id: studentId },
                attributes: ['recordId']
            });
    
            // Convert to a format suitable for the frontend to process
            const recordIds = records.map(r => r.recordId);
            res.json({ recordIds });
        } catch (error) {
            console.error('Error fetching student records:', error);
            res.status(500).send('Error processing request');
        }
    }

    async updateStudentCummulativeRecord(req, res) {
        try{
            console.log(req.body);
            const abilityIntelligenceTest = await this.updateStudentAbilityIntelligenceTest(req, res);
            const studentRecords = await GuidanceModel.StudentRecords();
            if(abilityIntelligenceTest){
                res.render('Guidance', {message: {content: 'Error updating Cummulative Record'}, studentRecords: studentRecords});
            } else{
                res.render('Guidance', {message: {isSuccess: true, content: 'Student Cummulative Record updated!'}, studentRecords: studentRecords})
            }
        } catch (error) {
            const studentRecords = await GuidanceModel.StudentRecords();
            res.render('Guidance', {message: {content: 'Error updating Cummulative Record'}, studentRecords: studentRecords})
        }
    }

    async updateStudentSchoolHistory(req, res) {
        try {
            const newSchoolHistory = await GuidanceModel.updateStudentSchoolHistory(req.body.student_id, req.body.enteredFrom, req.body.gradeLevelEntered, req.body.schoolYearAdmitted, req.body.otherSchoolsAttended);
            if(newSchoolHistory.error){
                return {error: newSchoolHistory.error};
            }
        } catch (error) {
            const studentRecords = await GuidanceModel.StudentRecords();
            res.render('Guidance', {message: {content: error.message}, studentRecords: studentRecords});
        }
    }

    async getStudentCummulativeRecord(req, res){
        try {
            const cummulativeRecord = {
                schoolHistory: await this.getStudentSchoolHistory(req, res),
                familyData: await this.getStudentFamilyData(req, res),
                schoolActivity: await this.getStudentSchoolActivities(req, res),
                abilityIntelligenceTest: await this.getStudentAbilityIntelligenceTest(req, res),
            }
            res.json(cummulativeRecord);
        } catch (error) {

        }
    }

    async getStudentSchoolHistory(req, res) {
        const studentId = req.body.textData;
        try {
            
            const schoolHistory = await SchoolHistory.findOne({
                where: {student_id: studentId}
            });

            if(schoolHistory){
                const formattedSchoolHistory = {
                    enteredFrom: schoolHistory.enteredFrom,
                    gradeLevelEntered: schoolHistory.gradeLevelEntered,
                    schoolYearAdmitted: schoolHistory.schoolYearAdmitted,
                    otherSchoolsAttended: schoolHistory.otherSchoolsAttended
                }
                console.log('Successfully fetched student school history: ', schoolHistory);
                return formattedSchoolHistory;
            } else {
                const formattedSchoolHistory = {
                    enteredFrom: '',
                    gradeLevelEntered: '',
                    schoolYearAdmitted: '',
                    otherSchoolsAttended: ''
                }
                console.log('Student School history not found');
                return formattedSchoolHistory;
            }
        } catch(error) {
            console.error('Error fetching school history: ', error);
            res.status(500).send('Error processing request');
        }
    }

    async updateStudentFamilyData(req, res) {
        try{
            const newFamilyData = await GuidanceModel.updateStudentFamilyData(req.body.student_id, req.body.student_name, req.body.student_birthday, req.body.student_citizenship,
                                                                                req.body.student_address, req.body.student_occupation, req.body.father_name, req.body.father_birthday, 
                                                                                req.body.father_citizenship, req.body.father_address, req.body.father_occupation, req.body.mother_name,
                                                                                req.body.mother_birthday, req.body.mother_citizenship, req.body.mother_address, req.body.mother_occupation,
                                                                                req.body.guardian_name, req.body.guardian_birthday, req.body.guardian_citizenship, req.body.guardian_address,
                                                                                req.body.guardian_occupation, req.body.totalChildren, req.body.rankFamily, req.body.spokenLanguage,
                                                                                req.body.religion, req.body.parentStatus);
            if(newFamilyData.error){
                return {error: newFamilyData.error};
            }
        } catch (error) {
            console.log('Error updating/creating student family data', error);
        }
    }

    async getStudentFamilyData(req, res){
        const studentId = req.body.textData;
        try{
            const familyData = await FamilyData.findOne({
                where: {student_id: studentId}
            });
            if(familyData){
                const formattedFamilyData = {
                            studentName: familyData.studentName,
                            studentBirthday: familyData.studentBirthday,
                            studentCitizenship: familyData.studentCitizenship,
                            studentAddress_TelOrCpNum: familyData.studentAddress_TelOrCpNum,
                            studentOccupation: familyData.studentOccupation,
                            fatherName: familyData.fatherName,
                            fatherBirthday: familyData.fatherBirthday,
                            fatherCitizenship: familyData.fatherCitizenship,
                            fatherAddress_TelOrCpNum: familyData.fatherAddress_TelOrCpNum,
                            fatherOccupation: familyData.fatherOccupation,
                            motherName: familyData.motherName,
                            motherBirthday: familyData.motherBirthday,
                            motherCitizenship: familyData.motherCitizenship,
                            motherAddress_TelOrCpNum: familyData.motherAddress_TelOrCpNum,
                            motherOccupation: familyData.motherOccupation,
                            guardianName: familyData.guardianName,
                            guardianBirthday: familyData.guardianBirthday,
                            guardianCitizenship: familyData.guardianCitizenship,
                            guardianAddress_TelOrCpNum: familyData.guardianAddress_TelOrCpNum,
                            guardianOccupation: familyData.guardianOccupation,
                            totalNumberOfChildren: familyData.totalNumberOfChildren,
                            rankInTheFamily: familyData.rankInTheFamily,
                            languageSpokenAtHome: familyData.languageSpokenAtHome,
                            religion: familyData.religion,
                            martialStatusofParents: familyData.martialStatusofParents,
                }
                console.log('succesfully fetched student family data: ', formattedFamilyData);
                return formattedFamilyData;
            } else {
                console.log('student family data not found');
            }
        } catch (error) {
            console.log('error fetching student family data', error);
            res.status(500).send('Error processing request');
        }
    }

    async updateStudentSchoolActivity(req, res) {
        try{
            const grade7SchoolActivity = await GuidanceModel.updateStudentSchoolActivities(req.body.student_id, req.body.schoolActivityGrade7 ,req.body.grade7_school_year, req.body.grade7_club_name, req.body.grade7_field_trips);
            const grade8SchoolActivity = await GuidanceModel.updateStudentSchoolActivities(req.body.student_id, req.body.schoolActivityGrade8 ,req.body.grade8_school_year, req.body.grade8_club_name, req.body.grade8_field_trips);
            const grade9SchoolActivity = await GuidanceModel.updateStudentSchoolActivities(req.body.student_id, req.body.schoolActivityGrade9 ,req.body.grade9_school_year, req.body.grade9_club_name, req.body.grade9_field_trips);
            const grade10SchoolActivity = await GuidanceModel.updateStudentSchoolActivities(req.body.student_id, req.body.schoolActivityGrade10 ,req.body.grade10_school_year, req.body.grade10_club_name, req.body.grade10_field_trips);
            const grade11SchoolActivity = await GuidanceModel.updateStudentSchoolActivities(req.body.student_id, req.body.schoolActivityGrade11 ,req.body.grade11_school_year, req.body.grade11_club_name, req.body.grade11_field_trips);
            const grade12SchoolActivity = await GuidanceModel.updateStudentSchoolActivities(req.body.student_id, req.body.schoolActivityGrade12 ,req.body.grade12_school_year, req.body.grade12_club_name, req.body.grade12_field_trips);
            if(grade7SchoolActivity.error || grade8SchoolActivity.error || grade9SchoolActivity.error || grade10SchoolActivity.error || grade11SchoolActivity.error || grade12SchoolActivity.error){
                if(grade7SchoolActivity.error){
                    return {error: grade7SchoolActivity.error}
                } else if(grade8SchoolActivity.error){
                    return {error: grade8SchoolActivity.error}
                } else if(grade9SchoolActivity.error){
                    return {error: grade9SchoolActivity.error}
                } else if(grade10SchoolActivity.error){
                    return {error: grade10SchoolActivity.error}
                } else if(grade11SchoolActivity.error){
                    return {error: grade11SchoolActivity.error}
                } else if(grade12SchoolActivity.error){
                    return {error: grade12SchoolActivity.error}
                }
            }
        } catch (error) {
            console.log('Error updating school activity', error);
        }
    }

    async getStudentSchoolActivities(req, res){
        const studentId = req.body.textData;

        const schoolActivity = await SchoolActivity.findAll({
            where: {student_id: studentId}
        });
        if(schoolActivity){
            const formattedSchoolActivity = schoolActivity.map(record => record.dataValues);
            console.log(formattedSchoolActivity);
            return formattedSchoolActivity;
        } else {
            console.log('Student School Activity Not Found');
        }
    }

    async updateStudentAbilityIntelligenceTest(req, res) {
        try{
            const juniorKinderAbilityIntelligenceTest = await GuidanceModel.updateStudentAbilityIntelligenceTest(req.body.student_id, req.body.juniorkinder_ability_intelligence, req.body.test_type_AI_test_gs, req.body.date_AI_test_gs, req.body.grade_level_AI_test_gs,
                                                                                                            req.body.juniorkinder_date, req.body.juniorkinder_test_administered, req.body.juniorkinder_raw_score, req.body.juniorkinder_CA, req.body.juniorkinder_IQ_SAI, req.body.juniorkinder_percentile,
                                                                                                            req.body.juniorkinder_stanine, req.body.juniorkinder_remarks);
            const seniorKinderAbilityIntelligenceTest = await GuidanceModel.updateStudentAbilityIntelligenceTest(req.body.student_id, req.body.seniorkinder_ability_intelligence, req.body.test_type_AI_test_gs, req.body.date_AI_test_gs, req.body.grade_level_AI_test_gs,
                                                                                                            req.body.seniorkinder_date, req.body.seniorkinder_test_administered, req.body.seniorkinder_raw_score, req.body.seniorkinder_CA, req.body.seniorkinder_IQ_SAI, req.body.seniorkinder_percentile,
                                                                                                            req.body.seniorkinder_stanine, req.body.seniorkinder_remarks);
            const grade1AbilityIntelligenceTest = await GuidanceModel.updateStudentAbilityIntelligenceTest(req.body.student_id, req.body.grade1_ability_intelligence, req.body.test_type_AI_test_gs, req.body.date_AI_test_gs, req.body.grade_level_AI_test_gs,
                                                                                                            req.body.grade1_date, req.body.grade1_test_administered, req.body.grade1_raw_score, req.body.grade1_CA, req.body.grade1_IQ_SAI, req.body.grade1_percentile,
                                                                                                            req.body.grade1_stanine, req.body.grade1_remarks);
            const grade2AbilityIntelligenceTest = await GuidanceModel.updateStudentAbilityIntelligenceTest(req.body.student_id, req.body.grade2_ability_intelligence, req.body.test_type_AI_test_gs, req.body.date_AI_test_gs, req.body.grade_level_AI_test_gs,
                                                                                                            req.body.grade2_date, req.body.grade2_test_administered, req.body.grade2_raw_score, req.body.grade2_CA, req.body.grade2_IQ_SAI, req.body.grade2_percentile,
                                                                                                            req.body.grade2_stanine, req.body.grade2_remarks);
            const grade3AbilityIntelligenceTest = await GuidanceModel.updateStudentAbilityIntelligenceTest(req.body.student_id, req.body.grade3_ability_intelligence, req.body.test_type_AI_test_gs, req.body.date_AI_test_gs, req.body.grade_level_AI_test_gs,
                                                                                                            req.body.grade3_date, req.body.grade3_test_administered, req.body.grade3_raw_score, req.body.grade3_CA, req.body.grade3_IQ_SAI, req.body.grade3_percentile,
                                                                                                            req.body.grade3_stanine, req.body.grade3_remarks);
            const grade4AbilityIntelligenceTest = await GuidanceModel.updateStudentAbilityIntelligenceTest(req.body.student_id, req.body.grade4_ability_intelligence, req.body.test_type_AI_test_gs, req.body.date_AI_test_gs, req.body.grade_level_AI_test_gs,
                                                                                                            req.body.grade4_date, req.body.grade4_test_administered, req.body.grade4_raw_score, req.body.grade4_CA, req.body.grade4_IQ_SAI, req.body.grade4_percentile,
                                                                                                            req.body.grade4_stanine, req.body.grade4_remarks);
            const grade5AbilityIntelligenceTest = await GuidanceModel.updateStudentAbilityIntelligenceTest(req.body.student_id, req.body.grade5_ability_intelligence, req.body.test_type_AI_test_gs, req.body.date_AI_test_gs, req.body.grade_level_AI_test_gs,
                                                                                                            req.body.grade5_date, req.body.grade5_test_administered, req.body.grade5_raw_score, req.body.grade5_CA, req.body.grade5_IQ_SAI, req.body.grade5_percentile,
                                                                                                            req.body.grade5_stanine, req.body.grade5_remarks);
            const grade6AbilityIntelligenceTest = await GuidanceModel.updateStudentAbilityIntelligenceTest(req.body.student_id, req.body.grade6_ability_intelligence, req.body.test_type_AI_test_gs, req.body.date_AI_test_gs, req.body.grade_level_AI_test_gs,
                                                                                                            req.body.grade6_date, req.body.grade6_test_administered, req.body.grade6_raw_score, req.body.grade6_CA, req.body.grade6_IQ_SAI, req.body.grade6_percentile,
                                                                                                            req.body.grade6_stanine, req.body.grade6_remarks);
            const grade7AbilityIntelligenceTest = await GuidanceModel.updateStudentAbilityIntelligenceTest(req.body.student_id, req.body.grade7_ability_intelligence, req.body.test_type_AI_test, req.body.date_AI_test, req.body.grade_level_AI_test,
                                                                                                            req.body.grade7_date, req.body.grade7_test_administered, req.body.grade7_raw_score, req.body.grade7_CA, req.body.grade7_IQ_SAI, req.body.grade7_percentile,
                                                                                                            req.body.grade7_stanine, req.body.grade7_remarks);
            const grade8AbilityIntelligenceTest = await GuidanceModel.updateStudentAbilityIntelligenceTest(req.body.student_id, req.body.grade8_ability_intelligence, req.body.test_type_AI_test, req.body.date_AI_test, req.body.grade_level_AI_test,
                                                                                                            req.body.grade8_date, req.body.grade8_test_administered, req.body.grade8_raw_score, req.body.grade8_CA, req.body.grade8_IQ_SAI, req.body.grade8_percentile,
                                                                                                            req.body.grade8_stanine, req.body.grade8_remarks);
            const grade9AbilityIntelligenceTest = await GuidanceModel.updateStudentAbilityIntelligenceTest(req.body.student_id, req.body.grade9_ability_intelligence, req.body.test_type_AI_test, req.body.date_AI_test, req.body.grade_level_AI_test,
                                                                                                            req.body.grade9_date, req.body.grade9_test_administered, req.body.grade9_raw_score, req.body.grade9_CA, req.body.grade9_IQ_SAI, req.body.grade9_percentile,
                                                                                                            req.body.grade9_stanine, req.body.grade9_remarks);
            const grade10AbilityIntelligenceTest = await GuidanceModel.updateStudentAbilityIntelligenceTest(req.body.student_id, req.body.grade10_ability_intelligence, req.body.test_type_AI_test, req.body.date_AI_test, req.body.grade_level_AI_test,
                                                                                                            req.body.grade10_date, req.body.grade10_test_administered, req.body.grade10_raw_score, req.body.grade10_CA, req.body.grade10_IQ_SAI, req.body.grade10_percentile,
                                                                                                            req.body.grade10_stanine, req.body.grade10_remarks);
            const grade11AbilityIntelligenceTest = await GuidanceModel.updateStudentAbilityIntelligenceTest(req.body.student_id, req.body.grade11_ability_intelligence, req.body.test_type_AI_test, req.body.date_AI_test, req.body.grade_level_AI_test,
                                                                                                            req.body.grade11_date, req.body.grade11_test_administered, req.body.grade11_raw_score, req.body.grade11_CA, req.body.grade11_IQ_SAI, req.body.grade11_percentile,
                                                                                                            req.body.grade11_stanine, req.body.grade11_remarks);
            const grade12AbilityIntelligenceTest = await GuidanceModel.updateStudentAbilityIntelligenceTest(req.body.student_id, req.body.grade12_ability_intelligence, req.body.test_type_AI_test, req.body.date_AI_test, req.body.grade_level_AI_test,
                                                                                                            req.body.grade12_date, req.body.grade12_test_administered, req.body.grade12_raw_score, req.body.grade12_CA, req.body.grade12_IQ_SAI, req.body.grade12_percentile,
                                                                                                            req.body.grade12_stanine, req.body.grade12_remarks);
            if(grade7AbilityIntelligenceTest.error || grade8AbilityIntelligenceTest.error || grade9AbilityIntelligenceTest.error || grade10AbilityIntelligenceTest.error || grade11AbilityIntelligenceTest.error || grade12AbilityIntelligenceTest.error
                || juniorKinderAbilityIntelligenceTest.error || seniorKinderAbilityIntelligenceTest.error || grade1AbilityIntelligenceTest.error || grade2AbilityIntelligenceTest.error || grade3AbilityIntelligenceTest.error
                || grade4AbilityIntelligenceTest.error || grade5AbilityIntelligenceTest.error || grade6AbilityIntelligenceTest.error){
                if(grade7AbilityIntelligenceTest.error){
                    return {error: grade7AbilityIntelligenceTest.error}
                } else if(grade8AbilityIntelligenceTest.error){
                    return {error: grade8AbilityIntelligenceTest.error}
                } else if(grade9AbilityIntelligenceTest.error){
                    return {error: grade9AbilityIntelligenceTest.error}
                } else if(grade10AbilityIntelligenceTest.error){
                    return {error: grade10AbilityIntelligenceTest.error}
                } else if(grade11AbilityIntelligenceTest.error){
                    return {error: grade11AbilityIntelligenceTest.error}
                } else if(grade12AbilityIntelligenceTest.error){
                    return {error: grade12AbilityIntelligenceTest.error}
                } else if(juniorKinderAbilityIntelligenceTest.error){
                    return {error: juniorKinderAbilityIntelligenceTest.error}
                } else if(seniorKinderAbilityIntelligenceTest.error){
                    return {error: seniorKinderAbilityIntelligenceTest.error}
                } else if(grade1AbilityIntelligenceTest.error){
                    return {error: grade1AbilityIntelligenceTest.error}
                } else if(grade2AbilityIntelligenceTest.error){
                    return {error: grade2AbilityIntelligenceTest.error}
                } else if(grade3AbilityIntelligenceTest.error){
                    return {error: grade3AbilityIntelligenceTest.error}
                } else if(grade4AbilityIntelligenceTest.error){
                    return {error: grade4AbilityIntelligenceTest.error}
                } else if(grade5AbilityIntelligenceTest.error){
                    return {error: grade5AbilityIntelligenceTest.error}
                } else if(grade6AbilityIntelligenceTest.error){
                    return {error: grade6AbilityIntelligenceTest.error}
                }
            }
        } catch (error){
            console.log('Error updating ability/intelligence test: ', error);
        }
    }

    async getStudentAbilityIntelligenceTest(req, res){
        const studentId = req.body.textData;

        const abilityIntelligenceTest = await AbilityIntelligenceTest.findAll({
            where: {student_id: studentId}
        });
        if(abilityIntelligenceTest){
            const formattedAbilityIntelligenceTest = abilityIntelligenceTest.map(record => record.dataValues);
            console.log('successfully fetched ability/intelligence test: ', formattedAbilityIntelligenceTest);
            return formattedAbilityIntelligenceTest;
        } else {
            console.log('Student ability/intelligence test not found');
        }
    }
}