import { useState } from "react";
import { timestamp } from "../../../../firebase/config";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useFireStore } from "../../../../hooks/useFireStore";
import Avatar from "../../../../components/Avatar/Avatar";
import "./ProjectComments.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
function ProjectComments({ project }) {
  const [newComment, setNewComment] = useState("");
  const { user } = useAuthContext();
  const { updateDocument, response } = useFireStore("projects");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const commentToAdd = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      createAt: timestamp.fromDate(new Date()),
      content: newComment,
      id: Math.random(),
    };
    await updateDocument(project.id, {
      comments: [...project.comments, commentToAdd],
    });
    if (!response.error) {
      setNewComment("");
    }
  };
  return (
    <div className="project-comments">
      <h4>Project Comments</h4>
      <ul>
        {project.comments.map((comment) => (
          <li key={comment.id}>
            <div className="comment-author">
              <Avatar src={comment.photoURL} />
              <p>{comment.displayName}</p>
            </div>
            <div className="comment-date">
              <p>
                {formatDistanceToNow(comment.createAt.toDate(), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="comment-content">
              <p>{comment.content}</p>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="add-comment">
        <label>
          <span>Add new comment:</span>
          <textarea
            required
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
          />
        </label>
        <button className="btn">Add</button>
      </form>
    </div>
  );
}

export default ProjectComments;
