import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAppContext } from "../contexts/AppContext";
import { toast } from "react-toastify";
import { CalendarClock } from "lucide-react";

const CreateLectureForm = () => {
    const { backendUrl, courseId, userId } = useAppContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [callDetails, setCallDetail] = useState()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();

    const startDateTime = watch("startDateTime");

    // Current datetime (for start)
    const now = new Date();
    const minStartDateTime = now.toISOString().slice(0, 16);

    // Compute minimum end datetime (start + 30 mins)
    const minEndDateTime = useMemo(() => {
        if (!startDateTime) return minStartDateTime;

        const start = new Date(startDateTime);
        start.setMinutes(start.getMinutes() + 30);
        return start.toISOString().slice(0, 16);
    }, [startDateTime, minStartDateTime]);


    // const scheduleOnStream = async (lecture) => {
    //     if (!client || !userData) return;
    //     try {
    //         if (!values.dateTime) {
    //             toast({ title: 'Please select a date and time' });
    //             return;
    //         }
    //         const id = lecture._id;
    //         const call = client.call('default', id);
    //         if (!call) throw new Error('Failed to create meeting');
    //         const startsAt = lecture.scheduledStart;
    //         const title = lecture.title;
    //         await call.getOrCreate({
    //             data: {
    //                 starts_at: startsAt,
    //                 custom: {
    //                     title,
    //                 },
    //             },
    //         });
    //         setCallDetail(call);
    //         if (!values.description) {
    //             router.push(`/meeting/${call.id}`);
    //         }
    //         const meetingLink = `${import.meta.env.VITE_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;
    //     } catch (error) {
    //         console.error(error);
    //         toast({ title: 'Failed to create Meeting' });
    //     }
    // };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            const payload = {
                title: data.title,
                scheduledStart: data.startDateTime,
                scheduledEnd: data.endDateTime,
                courseId,
                userId,
            };

            const response = await axios.post(
                `${backendUrl}/api/lectures/create?courseId=${courseId}`,
                payload,
                { withCredentials: true }
            );

            if (!response.data.success) {
                toast.error(response.data.message || "Failed to create lecture.");
            } else {
                toast.success("Lecture created successfully!");
                reset();
            }
            // scheduleOnStream(response.data.lecture);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error creating lecture.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Title */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">Lecture Title</label>
                    <input
                        {...register("title", { required: "Title is required" })}
                        type="text"
                        placeholder="Enter lecture title"
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm">{errors.title.message}</p>
                    )}
                </div>

                {/* Start DateTime */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">
                        Start Date & Time
                    </label>

                    <div className="relative">
                        <CalendarClock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            {...register("startDateTime", {
                                required: "Start date & time is required",
                            })}
                            type="datetime-local"
                            min={minStartDateTime}
                            className="pl-10 border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {errors.startDateTime && (
                        <p className="text-red-500 text-sm">
                            {errors.startDateTime.message}
                        </p>
                    )}
                </div>

                {/* End DateTime */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">
                        End Date & Time
                    </label>

                    <div className="relative">
                        <CalendarClock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            {...register("endDateTime", {
                                required: "End date & time is required",
                                validate: (value) => {
                                    if (!startDateTime) return true;

                                    const start = new Date(startDateTime);
                                    const end = new Date(value);

                                    const diffInMinutes =
                                        (end.getTime() - start.getTime()) / 60000;

                                    return (
                                        diffInMinutes >= 30 ||
                                        "End time must be at least 30 minutes after start"
                                    );
                                },
                            })}
                            type="datetime-local"
                            min={minEndDateTime}
                            disabled={!startDateTime}
                            className="pl-10 border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                        />
                    </div>

                    {errors.endDateTime && (
                        <p className="text-red-500 text-sm">
                            {errors.endDateTime.message}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <div className="md:col-span-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition disabled:opacity-60"
                    >
                        {isSubmitting ? "Creating Lecture..." : "Create Lecture"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateLectureForm;
