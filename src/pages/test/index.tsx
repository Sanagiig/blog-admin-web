import {add, minus, selectCount} from "@/store/reducers/test";
import {useSelector, useDispatch} from "react-redux";
import {useGetPostByIDQuery, useAddNewPostMutation} from "@/store/apiSlice";
import {useEffect} from "react";
import {useLocation, useMatch, useParams} from "react-router";
// export default function Test({router}: any) {
//   const count = useSelector(selectCount);
//   const dispatch = useDispatch();
//
//   const handleAdd = () => {
//     dispatch(add());
//   };
//
//   const handleMinus = () => {
//     dispatch(minus());
//   };
//   const {id = "1"} = useParams();
//   const [addPost, {isLoading}] = useAddNewPostMutation();
//   const {isLoading: isLoading2} = useGetPostByIDQuery(id);
//
//   const handleSubmit = () => {
//     addPost({qq: 1, wer: "123123"});
//   };
//   useEffect(() => {
//     console.log("list", isLoading);
//   }, [isLoading]);
//   return (
//     <div>
//       <h1>count : {count}</h1>
//       <button onClick={handleAdd}>add</button>
//       <button onClick={handleMinus}>minus</button>
//       <button onClick={handleSubmit}>submit</button>
//     </div>
//   );
// }

export default function Test({router}: any) {
  return (<h1>test</h1>)
}