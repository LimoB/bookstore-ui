import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type UserRole = "admin" | "member" | "author";

export interface User {
  userId: string;
  fullName: string;
  email: string;
  user_type: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  fullName: string;
  email: string;
  password: string;
  user_type?: UserRole;
}

export interface UpdateUserInput {
  fullName?: string;
  email?: string;
  password?: string;
  user_type?: UserRole;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        if (import.meta.env.DEV) {
          console.debug("🪪 Token attached:", token);
        }
      } else {
        if (import.meta.env.DEV) {
          console.warn("⚠️ No token found in localStorage");
        }
      }

      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // 🔐 Fetch all users — Admin only
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: (result) =>
        result
          ? [
              ...result.map((user) => ({ type: "User" as const, id: user.userId })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // 🔍 Get a user by ID
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_res, _err, id) => [{ type: "User", id }],
    }),

    // ➕ Create user
    createUser: builder.mutation<User, CreateUserInput>({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // ✏️ Update user
    updateUser: builder.mutation<User, { id: string; data: UpdateUserInput }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    // 🗑 Delete user
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
