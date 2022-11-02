module.exports = (sequelize,Sequelize)=>{
    const Designation = sequelize.define("designation",{
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name:{
            type:Sequelize.STRING,
        },
        isParent:{
            type:Sequelize.BOOLEAN,
            defaultValue:false
        },
        parentId:{
            type:Sequelize.INTEGER,
            allowNull:true
        }
    })
    return Designation
}