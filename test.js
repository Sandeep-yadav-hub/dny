// var add = function(x, y) {
//     return new Promise((resolve,reject) => {
//       var sum = x + y;
//       if (sum) {
//         resolve(sum);
//       }
//       else {
//         reject(Error("Could not add the two values!"));
//       }
//     });
//   };


// function Car(fuelType,type){
//     this.type = type;
//     this.fuelType = fuelType;
// }

// function setBrand(brand){
// 	Car.call(this, "petrol" ,"convertible");
// 	this.brand = brand;
// 	console.log(`Car details = `, this);
// }

// function definePrice(price){
// 	Car.call(this, "diesel", "convertible");
// 	this.price = price;
// 	console.log(`Car details = `, this);
// }

// const newBrand = new setBrand('Brand1');
// const newCarPrice = new definePrice(100000);

// let me = { 
//     name: "Ashutosh Verma", 
//     thisInArrow:() => { 
//     console.log("My name is " + this.name); // no 'this' binding here 
//     }, 
//     thisInRegular(){ 
//     console.log("My name is " + this.name); // 'this' binding works here 
//     } 
//    };
//    me.thisInArrow(); 
//    me.thisInRegular();


// setTimeout(() => {
//     console.log("hello from timeout")
// }, 5000);
// console.log("hello")
// setImmediate(()=>{
//     console.log("hello from immediate")
// })

// function Car(type, fuelType){
// 	this.type = type;
// 	this.fuelType = fuelType;
// }

// function setBrand(brand){
// 	Car.apply(this, ["convertible", "petrol"]); //Syntax with array literal
// 	this.brand = brand;
// 	console.log(`Car details = `, this);
// }

// function definePrice(price){
// 	Car.apply(this, new Array("convertible", "diesel")); //Syntax with array object construction
// 	this.price = price;
// 	console.log(`Car details = `, this);
// }

// const newBrand = new setBrand('Brand1');
// const newCarPrice = new definePrice(100000);



// function getDepartmentList(data){
//     var queryString = "?"
//     for(const d in data){
//         queryString = `${queryString}${d}=${data[d]}&`
//     }
//     return queryString
// }
// console.log(getDepartmentList({limit:10,offset:0}))

const createData = (id,name,firstReportTo,secondReportTo)=>{
    return {
        id,
        name,
        primaryReportsTo:firstReportTo,
        secondryReportsTo:secondReportTo
    }
}

var data = [
    createData("deep",null,null),
    createData("deepika","meenal",null),
    createData("meenal","sahil",null),
    createData("sandeep","deepika","meenal"),
    createData("sahil","deep",null),
]
var data2 = [
    createData(1,"deep",null,null),
    createData(2,"deepika",{...createData(3,"meenal",{...createData(5,"sahil",{...createData(1,"deep",null,null)},null)},null)},null),
    createData(3,"meenal",{...createData(5,"sahil",{...createData(1,"deep",null,null)})},null),
    createData(4,"sandeep",createData(2,"deepika",{...createData(3,"meenal",{...createData(5,"sahil",{...createData(1,"deep",null,null)})},null)},null),createData(3,"meenal",{...createData(5,"sahil",{...createData(1,"deep",null,null)})},null)),
    createData(5,"sahil",{...createData(1,"deep",null,null),},null),
]
console.log(data2)
const idMapping = data2.reduce((acc, el, i) => {
    acc[el.id] = i;
    return acc;
}, {});
console.log(idMapping)
let root;
data2.forEach(el => {
  // Handle the root element
  if (el.primaryReportsTo === null) {
    root = el;
    return;
  }
  // Use our mapping to locate the parent element in our data2 array
  const parentEl = data2[idMapping[el.primaryReportsTo.id]];
  // Add our current el to its parent's `children` array
  parentEl.children = [...(parentEl.children || []), el];
});
console.log(JSON.stringify(root,null,2));




function* infinityAndBeyond(iterable){
    let i =0;
    while(true){
        let data = iterable[i]
        i++
        yield data
    }
}

function* take(n,iterable){
    for(let item of iterable){
        if (n<=0) return
        n--
        yield item
    }
}

function* map(iterable,myFn){
    for(let item of iterable){
        yield myFn(item)
    }
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}



