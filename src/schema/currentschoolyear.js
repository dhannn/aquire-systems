import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../DBConnection.js';


export const CurrentSchoolYear = sequelize.define('CurrentSchoolYear', {
    fromYear: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    toYear: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

CurrentSchoolYear.toString = async function() {
    let promise = new Promise(
        (resolve, reject) => {
            CurrentSchoolYear.findOne()
                .then((data) => {
                    const from = data.fromYear;
                    const to = data.toYear;
        
                    resolve(`${from}-${to}`);
                }).catch((error) => {
                    reject(error);
                });
        }
    )
    
    return promise;
}

CurrentSchoolYear.next = async function() {
    let promise = new Promise(async (resolve, reject) => {
        const schoolYear = await CurrentSchoolYear.findOne();
        
        try {
            await schoolYear.increment(['fromYear', 'toYear']);
        } catch (error) {
            reject(error);      
        }
        
        schoolYear.save()
            .then(data => resolve(data))
            .catch(error => reject(error));
    });

    return promise;
}
