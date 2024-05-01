const PostModel = require('../models/Post');

exports.getAll = async () => {
    return await PostModel.find({ is_approved: 'approved', }).sort({ createdAt: -1 });
};

exports.getPostsByUser = async (uid) => {
    return await PostModel.find({ is_approved: 'approved', uid: uid }).sort({ createdAt: -1 });
};

exports.getPostsPending = async () => {
    return await PostModel.find({ is_approved: 'pending' }).sort({ createdAt: -1 });
};
exports.getMyPosts = async (uid) => {
    return await PostModel.find({ uid: uid }).sort({ createdAt: -1 });
};


// exports.getPendingPost = async () => {
//     return await PostModel.find({ is_approved: 'pending' }).sort({ createdAt: -1 });
// };

exports.createPost = async (Post) => {
    return await PostModel.create(Post);
};
exports.getPostById = async (id) => {
    return await PostModel.findById(id);
};

exports.updatePost = async (id, Post) => {
    return await PostModel.findByIdAndUpdate(id, Post);
};

exports.approvePost = async (id, is_approved) => {
    return await PostModel.findByIdAndUpdate(id, { is_approved: is_approved });
};

exports.deletePost = async (id) => {
    return await PostModel.findByIdAndDelete(id);
};
exports.searchPost = async (searchText) => {
    if (searchText === undefined) searchText = ''
    const regexSearch = new RegExp(searchText);
    console.log(`regexSearch: ${regexSearch}`);
    if (!searchText) return await PostModel.find({ is_approved: 'approved', }).sort({ createdAt: -1 });
    return await PostModel.find(
        {
            $or: [
                { $text: { $search: regexSearch } },

            ],
            is_approved: 'approved'
        },
        { score: { $meta: 'textScore' } }
    )
        .sort({ score: { $meta: 'textScore' } })
        .lean();
};

exports.likePost = async (post_id, user_id) => {
    const post = await PostModel.findById(post_id);
    if (!post.likes.includes(user_id)) {
        await post.updateOne({ $push: { likes: user_id } });
        return 1;
    } else {
        await post.updateOne({ $pull: { likes: user_id } });
        return -1;
    }
};
