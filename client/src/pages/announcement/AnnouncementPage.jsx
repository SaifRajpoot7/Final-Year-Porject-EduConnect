import { useAppContext } from "../../contexts/AppContext";
import AnnouncementCreate from "./AnnouncementCreate";
import AnnouncementList from "./AnnouncementList";

const AnnouncementPage = () => {
    const { backendUrl, courseId } = useAppContext();

    const refreshList = () => {
        // You can trigger fetch but simplest approach is:
        window.location.reload();
    };

    return (
        <div className="max-w-3xl mx-auto pt-6">
            <AnnouncementCreate
                backendUrl={backendUrl}
                courseId={courseId}
                onSuccess={refreshList}
            />

            <AnnouncementList backendUrl={backendUrl} courseId={courseId} />
        </div>
    );
};

export default AnnouncementPage;
