import ImageUpload from "../../components/ImageUpload";
import FileInput, { useFormik } from "formik";
import { useState, useContext } from "react";
import pb from "../api/pocketbase";
import { UserContext } from "../../context/user-context";
import { useRouter } from "next/router";

const Newpost = () => {
  const [state, dispatch] = useContext(UserContext);
  const router = useRouter();
  const [files, setFiles] = useState<FileList | null>(null);
  const updateState = (variable) => {
    setFiles(variable);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      body: "",
      images: [],
      author: state.user,
    },

    onSubmit: async (values) => {
      try {
        const newPost = await JSON.stringify(values);
        console.log(values);
        await pb.collection("articles").create(newPost);
      } catch (err) {
        alert("Formik error: " + err);
      }
      //navigate("/");
      return;
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div class="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800 space-x-4 space-y-4">
          <input
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
            id="title"
            type="text"
            placeholder="Enter Title"
            required
          />

          <textarea
            id="body"
            name="body"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.body}
            rows="12"
            required
          ></textarea>

          <input
            id="images"
            name="images"
            type="file"
            value={formik.values.images}
            onChange={formik.handleChange}
          />
        </div>
        <button>Publish</button>
      </form>
    </div>
  );
};

export default Newpost;