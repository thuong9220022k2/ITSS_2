import Http from './api'
const BaseUrl=`http://localhost:8000/api`
class PostService{
    
    getAllPost=async ()=>{
        try{
            const url=`${BaseUrl}/post`
            return await Http.get(url);
        }catch(err){
            console.log("[get all post]",err)
            return null;
        }
        
    }
    approvePost=async (id,data)=>{
        try{
            console.log(id,data,"post")
            const url=`${BaseUrl}/post/${id}`
            return await Http.put(url,data);
        }catch(err){
            console.log("[get all post]",err)
            return null;
        }
        
    }

    getPendingPosts=async ()=>{
        try{
            const url=`${BaseUrl}/post/pending-post`
            return await Http.get(url);
        }catch(err){
            console.log("[get pending post]",err)
            return null;
        }
        
    }
    getPostById=async (id)=>{
        try{
            const url=`${BaseUrl}/post/${id}`
            return await Http.get(url);
        }catch(err){
            console.log("[get  post]",err)
            return null;
        }
        
    }

    likePost=async (postId)=>{
        try{
            const url=`${BaseUrl}/post/${postId}/like`
            return await Http.post(url);
        }catch(err){
            console.log("[get all post]",err)
            return null;
        }
        
    }

    searchPost=async (searchText)=>{
        try{
            const url=`${BaseUrl}/post/search`
            return await Http.post(url,{searchText});
        }catch(err){
            console.log("[get all post]",err)
            return null;
        }
        
    }

    getPostByUser=async (uid)=>{
        try{
            const url=`${BaseUrl}/post/by-user/${uid}`;
            return await Http.get(url);
        }catch(err){
            console.log("[get all post]",err)
            return null;
        }
        
    }
    getMyPosts=async (uid)=>{
        try{
            const url=`${BaseUrl}/post/my-post`;
            return await Http.get(url);
        }catch(err){
            console.log("[get all post]",err)
            return null;
        }
        
    }


    deletePost=async (postId)=>{
        try{
            const url=`${BaseUrl}/post/${postId}`
            return await Http.delete(url);
        }catch(err){
            console.log("[delete post]",err)
            return null;
        }
        
    }

    uploadPost=async (post)=>{
        try {
            const url=`${BaseUrl}/post`
            const newPost= await Http.post(url,post);
            const postId= newPost._id
            // await setDoc(doc(db, "comments", postId), { comments: [] });
            console.log("[new post]",newPost);
            return newPost

        } catch (err) {
            console.log("[upload post]",err)
            return null;
        }
    }
    updatePost=async (post)=>{
        try {
            const url=`${BaseUrl}/post/${post._id}`
            const newPost= await Http.put(url,post);
            // const postId= newPost.data._id
            // await setDoc(doc(db, "comments", postId), { comments: [] });
            console.log("[update post]",newPost);
            return newPost
        } catch (err) {
            console.log("[update post]",err)
            return null;
        }
    }
}

export default  new PostService()