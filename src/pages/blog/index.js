import React from 'react';
import { graphql, Link } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';
import { IconZap } from '@components/icons';

const StyledMainContainer = styled.main`
  & > header {
    margin-bottom: 100px;
    text-align: center;

    a {
      &:hover,
      &:focus {
        cursor: 20 0, auto;
      }
    }
  }

  footer {
    ${({ theme }) => theme.mixins.flexBetween};
    width: 100%;
    margin-top: 20px;
  }
`;
const StyledGrid = styled.div`
  margin-top: 50px;

  .posts {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 15px;
    position: relative;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }
`;
const StyledPostInner = styled.div`
  ${({ theme }) => theme.mixins.boxShadow};
  ${({ theme }) => theme.mixins.flexBetween};
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  height: 100%;
  padding: 2rem 1.75rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  background-color: var(--light-navy);

  header,
  a {
    width: 100%;
  }
`;
const StyledPost = styled.div`
  transition: var(--transition);
  cursor: default;

  &:hover,
  &:focus {
    outline: 0;
    ${StyledPostInner} {
      transform: translateY(-5px);
    }
  }
`;
const StyledPostHeader = styled.div`
  ${({ theme }) => theme.mixins.flexBetween};
  margin-bottom: 30px;
`;
const StyledFolder = styled.div`
  color: var(--green);
  svg {
    width: 40px;
    height: 40px;
  }
`;
const StyledPostName = styled.h5`
  margin: 0 0 10px;
  color: var(--lightest-slate);
  font-size: var(--fz-xxl);
`;
const StyledPostDescription = styled.div`
  color: var(--light-slate);
  font-size: 17px;
`;
const StyledDate = styled.span`
  color: var(--light-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  text-transform: uppercase;
`;
const StyledTags = styled.ul`
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
  list-style: none;

  li {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: 1.75;

    &:not(:last-of-type) {
      margin-right: 15px;
    }
  }
`;

const BlogPage = ({ location, data }) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location}>
      <Helmet title="Blog" />

      <StyledMainContainer>
        <header>
          <h1 className="big-heading">Blog</h1>
          <p className="subtitle">a collection of project write-ups</p>
        </header>

        <StyledGrid>
          <div className="posts">
            {posts.length > 0 &&
              posts.map(({ node }, i) => {
                const { frontmatter } = node;
                const { title, description, slug, date, tags } = frontmatter;
                const d = new Date(date);

                return (
                  <StyledPost key={i} tabIndex="0">
                    <StyledPostInner>
                      <header>
                        <Link to={slug}>
                          <StyledPostHeader>
                            <StyledFolder>
                              <IconZap />
                            </StyledFolder>
                          </StyledPostHeader>
                          <StyledPostName>{title}</StyledPostName>
                          <StyledPostDescription>{description}</StyledPostDescription>
                        </Link>
                      </header>
                      <footer>
                        <StyledDate>{`${d.toLocaleDateString()}`}</StyledDate>
                        <StyledTags>
                          {tags.map((tag, i) => (
                            <li key={i}>
                              <Link to={`/blog/tags/${kebabCase(tag)}/`} className="inline-link">
                                #{tag}
                              </Link>
                            </li>
                          ))}
                        </StyledTags>
                      </footer>
                    </StyledPostInner>
                  </StyledPost>
                );
              })}
          </div>
        </StyledGrid>
      </StyledMainContainer>
    </Layout>
  );
};

BlogPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default BlogPage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/posts/" }, frontmatter: { draft: { ne: true } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            description
            slug
            date
            tags
            draft
          }
          html
        }
      }
    }
  }
`;
