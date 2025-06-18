import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Author {
  authorId: number;
  authorName: string;
  genreId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAuthorInput {
  authorName: string;
  genreId: number;
}

export interface UpdateAuthorInput {
  authorName?: string;
  genreId?: number;
}

interface AuthorApiResponse {
  author_id: number;
  author_name: string;
  genre_id: number;
  created_at?: string;
  updated_at?: string;
}

const transformAuthor = (data: AuthorApiResponse): Author => ({
  authorId: data.author_id,
  authorName: data.author_name,
  genreId: data.genre_id,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

export const authorApi = createApi({
  reducerPath: "authorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Author"],
  endpoints: (builder) => ({
    getAllAuthors: builder.query<Author[], void>({
      query: () => "/authors",
      transformResponse: (
        response: { data: AuthorApiResponse[] } | AuthorApiResponse[]
      ): Author[] => {
        const rawAuthors = Array.isArray(response)
          ? response
          : response?.data ?? [];

        return rawAuthors
          .filter(
            (a): a is AuthorApiResponse =>
              !!a?.author_id && !!a?.author_name && !!a?.genre_id
          )
          .map(transformAuthor);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ authorId }) => ({
                type: "Author" as const,
                id: authorId,
              })),
              { type: "Author", id: "LIST" },
            ]
          : [{ type: "Author", id: "LIST" }],
    }),

    getAuthorById: builder.query<Author, number>({
      query: (id) => `/authors/${id}`,
      transformResponse: (
        response: { data: AuthorApiResponse } | AuthorApiResponse
      ): Author => {
        const raw = (response as any)?.data ?? response;
        return transformAuthor(raw);
      },
      providesTags: (_result, _error, id) => [{ type: "Author", id }],
    }),

    createAuthor: builder.mutation<Author, CreateAuthorInput>({
      query: (author) => ({
        url: "/authors",
        method: "POST",
        body: author,
      }),
      transformResponse: (
        response: { data: AuthorApiResponse } | AuthorApiResponse
      ): Author => {
        const raw = (response as any)?.data ?? response;
        return transformAuthor(raw);
      },
      invalidatesTags: [{ type: "Author", id: "LIST" }],
    }),

    updateAuthor: builder.mutation<
      Author,
      { id: number; data: UpdateAuthorInput }
    >({
      query: ({ id, data }) => ({
        url: `/authors/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (
        response: { data: AuthorApiResponse } | AuthorApiResponse
      ): Author => {
        const raw = (response as any)?.data ?? response;
        return transformAuthor(raw);
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Author", id },
        { type: "Author", id: "LIST" },
      ],
    }),

    deleteAuthor: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/authors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Author", id },
        { type: "Author", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllAuthorsQuery,
  useGetAuthorByIdQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
} = authorApi;
