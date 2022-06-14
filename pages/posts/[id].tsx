import React from "react";
import { gql } from "@apollo/client";

import { remark } from 'remark'
import html from 'remark-html'
import Link from 'next/link'

import client from "../../apollo-client";

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

type PostQuery = {
  allPost: {
    publishedAt: string; //ISO date string actually
    slug: {
      current: string;
    };
    title: string;
    body: string;
  }[]
}

export async function getStaticPaths() {
  const { data } = await client.query<PostQuery>({
    query: gql`
    query {
      allPost {
        publishedAt
        title
        slug {
          current
        }
        body
      }
    }
    `
  })
  const { allPost } = data;

  const paths: PostPaths[] = allPost.map(({ publishedAt, title, body, slug: { current: slug } }) => ({
    params: {
      id: [publishedAt.split('T')[0], slug].join('-'),
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
  const { data } = await client.query<PostQuery>({
    query: gql`
    query($slug:String) {
      allPost(where: {slug: {current: {eq:$slug}}}) {
        publishedAt
        title
        slug {
          current
        }
        body
      }
    }
    `,
    variables: {
      slug: slug.join('-')
    }
  })

  const post = data.allPost[0];
  const { title, body } = post;
  const processedContent = await remark()
    .use(html)
    .process(body)
  const bodyHtml = processedContent.toString();
  return {
    props: {
      id,
      title,
      bodyHtml
    }
  }
}