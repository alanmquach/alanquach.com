import React from "react";
import { gql } from "@apollo/client";

import { remark } from 'remark'
import html from 'remark-html'
import Link from 'next/link'

import client from "../../apollo-client";
import { AllPostsDocument, AllPostsQuery, PostBySlugDocument, PostBySlugQuery, PostFragment, SlugPostFragment } from "../../graphql/graphql";

type PostProps = {
  id: string;
  title: string;
  bodyHtml: string;
}

export default function Post({ id, title, bodyHtml }: PostProps) {
  return (
    <div className="content">
      <div className="post">
        <h1><Link href={`/posts/${id}`}>{title}</Link></h1>
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }}></div>
      </div>
    </div>
  )
}

type PostPaths = {
  params: PostParams
}

type PostParams = {
  id: string;
}

// type PostQuery = {
//   allPost: {
//     publishedAt: string; //ISO date string actually
//     slug: {
//       current: string;
//     };
//     title: string;
//     body: string;
//   }[]
// }

export async function getStaticPaths() {
  const { data } = await client.query<AllPostsQuery>({
    query: AllPostsDocument
  })

  const allPost: PostFragment[] = data?.allPost;

  const paths: PostPaths[] = allPost.map(({ publishedAt, title, body, slug }) => ({
    params: {
      id: [publishedAt.split('T')[0], slug?.current].join('-'),
      title,
      body,
    }
  }))

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: PostParams }): Promise<{ props: PostProps }> {
  const { id } = params;
  const [_year, _month, _day, ...slug] = id.split('-');
  const { data } = await client.query<PostBySlugQuery>({
    query: PostBySlugDocument,
    variables: {
      slug: slug.join('-')
    }
  })

  const allPost: SlugPostFragment[] = data?.allPost;

  const post = allPost[0];
  const { title, body } = post;
  const processedContent = body ? await remark()
    .use(html)
    .process(body) : ''
  const bodyHtml = processedContent.toString();
  return {
    props: {
      id,
      title: title ?? '',
      bodyHtml
    }
  }
}