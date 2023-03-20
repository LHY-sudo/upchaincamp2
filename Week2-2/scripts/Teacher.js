const {ethers} = require("hardhat")
const fs = require("fs");

async function main() {
    let Admin;
    let teacher;
    let student;
    let teach;
    let score
    [Admin,teacher,student] = await ethers.getSigners();
    const Teach = await ethers.getContractFactory("Teacher");
    const Score = await ethers.getContractFactory("Score");
    teach= await Teach.deploy(teacher.address);
    await teach.deployed();
    setTimeout(async function () {
        score = await Score.deploy(teach.address);
        await score.deployed();
    },4000)

    setTimeout(async function () {
        let resp = await teach.connect(Admin).setCourse(score.address);
        resp.wait().then((data) =>{
            console.log(data.status);
            console.log(`Teacher contract: ${teach.address}`)
            console.log(`score contract: ${score.address}`)
        })
    },10000)

    setTimeout(function () {
        try {
            fs.readFile("././address.json","utf8",(err,data) => {
                if (err) {
                    throw err
                }
                addressData = JSON.parse(data)
                let len = Object.keys(addressData).length
                let dict = new Object()
                dict[`Teacher:`] = teach.address;
                dict[`Score:`] = score.address;
                addressData[`${len}`] = dict;
                fs.writeFile('././address.json',JSON.stringify(addressData),(err) => {
                    if (err) {
                        throw err
                    }
                    console.log("地址写入成功")
                })
            })
        } catch (err) {
            console.log(err.message)
        }
    },10000)

}

main().catch((err) =>{
    console.log(err);
    process.exitCode = 1;
})