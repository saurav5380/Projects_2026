const prisma = require("../db")

const slugify = async (title) => {
    let baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

    if (!baseSlug) {
        baseSlug = 'draft';
    }

    let finalSlug = baseSlug;
    let counter = 2;

    while (true) {
        const existing = await prisma.posts.findUnique({ where: { slug: finalSlug } });
        if (!existing) {
            break;
        }
        if (counter > 10) {
            finalSlug = `${baseSlug}-${Date.now()}`;
            break;
        }
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
    }

    return finalSlug;
}

module.exports = slugify;
