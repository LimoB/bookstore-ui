import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Genre {
  genreId: number;
  genreName: string;
  genreCode: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGenreInput {
  genre_name: string;
  genre_code: string;
}

export interface GenreApiResponse {
  genre_id: number;
  genre_name: string;
  genre_code: string;
  created_at?: string;
  updated_at?: string;
  authors?: unknown[];  // Present, but intentionally ignored
}

const transformGenre = (genre: GenreApiResponse): Genre => ({
  genreId: genre.genre_id,
  genreName: genre.genre_name,
  genreCode: genre.genre_code,
  createdAt: genre.created_at,
  updatedAt: genre.updated_at,
});

export const genreApi = createApi({
  reducerPath: "genreApi",
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
  tagTypes: ["Genre"],
  endpoints: (builder) => ({
    getAllGenres: builder.query<Genre[], void>({
      query: () => "/genres",
      transformResponse: (response: unknown): Genre[] => {
        const rawGenres = Array.isArray(response)
          ? response
          : (response as any)?.data;

        if (!Array.isArray(rawGenres)) return [];

        return rawGenres
          .filter((g): g is GenreApiResponse =>
            g && typeof g.genre_id === "number" && typeof g.genre_name === "string"
          )
          .map(transformGenre);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ genreId }) => ({ type: "Genre" as const, id: genreId })),
              { type: "Genre", id: "LIST" },
            ]
          : [{ type: "Genre", id: "LIST" }],
    }),

    getGenreById: builder.query<Genre, number>({
      query: (id) => `/genres/${id}`,
      transformResponse: (response: any): Genre => {
        const raw = response?.data ?? response;
        return transformGenre(raw);
      },
      providesTags: (_result, _error, id) => [{ type: "Genre", id }],
    }),

    createGenre: builder.mutation<Genre, CreateGenreInput>({
      query: (genre) => ({
        url: "/genres",
        method: "POST",
        body: genre,
      }),
      transformResponse: (response: any): Genre => {
        const raw = response?.data ?? response;
        return transformGenre(raw);
      },
      invalidatesTags: [{ type: "Genre", id: "LIST" }],
    }),

    updateGenre: builder.mutation<Genre, { id: number; data: CreateGenreInput }>({
      query: ({ id, data }) => ({
        url: `/genres/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any): Genre => {
        const raw = response?.data ?? response;
        return transformGenre(raw);
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Genre", id }],
    }),

    deleteGenre: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/genres/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Genre", id },
        { type: "Genre", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllGenresQuery,
  useGetGenreByIdQuery,
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
} = genreApi;
