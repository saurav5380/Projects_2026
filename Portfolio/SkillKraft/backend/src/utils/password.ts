import bcrypt from 'bcrypt';

export const hashPassword = async (password:string) => {
    try{
        const saltRounds = 10;
        const hashPwd =  await bcrypt.hash(password, saltRounds);
        return hashPwd
    }
    catch(error){
        if (error instanceof Error){
            return (`Error:${error.message}`)
        }
    }
};


// used at login
export const verifyPassword = async(password:string, hashedPassword:string) =>{
    try{
        const verified = await bcrypt.compare(password, hashedPassword);
        if (!verified){
            return false
        }
        else return true
    }
    catch(error){
        if (error instanceof Error){
            return (`Error: ${error.message}`)
        }
    }
};