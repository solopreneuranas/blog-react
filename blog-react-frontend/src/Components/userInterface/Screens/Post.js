import BottomPostsComponent from "../Components/BottomPostsComponent";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import PostComponent from "../Components/PostComponent";
import { useLocation  } from 'react-router-dom';

export default function Post() {
    var location = useLocation()
    var post = location.state.post
    var postCategory = post.category
    return (
        <div>
            <Header />
            <PostComponent post={post} />
            <BottomPostsComponent api='display-post-list-by-category' category={postCategory} />
            <Footer />
        </div>
    )
}