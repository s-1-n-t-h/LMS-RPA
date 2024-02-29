export const isTeacher = (userId?: string | null) => {
  const teacherIdsStr = process.env.NEXT_PUBLIC_TEACHER_ID || "[]";
  const teacherIds = JSON.parse(teacherIdsStr);
  return Array.isArray(teacherIds) && teacherIds.includes(userId);
};
