module.exports = (sequelize,Sequelize)=>{
    const Department = sequelize.define("department",{
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name:{
            type:Sequelize.STRING,
        },
        branchId:{
            type:Sequelize.INTEGER,
            allowNull:false
        },
    })
    return Department
}