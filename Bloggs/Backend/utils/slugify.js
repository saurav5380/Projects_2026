
const prisma = require("../db")

const slugify = async (title) => {
    let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, ''); 
    
    if (!baseSlug){
        baseSlug = 'draft';
    }

    let finalSlug = baseSlug;
    
    while (true){
        counter = 2;
        const uniqueSlug = prisma.posts.findUnique({where: {slug: baseSlug}});
        if (!uniqueSlug){
            break;
        }
        finalSlug = `${baseSlug}`-`${counter}`;
        counter++;

        if (counter > 10){
            finalSlug = `${baseSlug}`-`${(new Date.now())}`;
            break;
        }
    }

    return finalSlug; 

} 

module.exports = slugify;




 