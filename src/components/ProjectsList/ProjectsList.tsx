import '@patternfly/react-core/dist/styles/base.css';

import { Table, TableHeader, TableBody, cellWidth } from '@patternfly/react-table';

import { Link } from 'react-router-dom';

export const ProjectsList = () => {
  const columns = [{ title: 'Name', transforms: [cellWidth(30)] }, 'Description'];

  const rows = [
    [{ title: <Link to="#">2020-11-25T12-09-56-991Z</Link> }, ''],
    [{ title: <Link to="#">bacon</Link> }, 'A new Java CLI for PNC 2.0 combining features of old PNC, DA CLI and PiG tooling.'],
    [{ title: <Link to="#">Causeway</Link> }, 'Causeway - Koji integration'],
    [{ title: <Link to="#">Commonjava/indy</Link> }, ''],
    [{ title: <Link to="#">Dekorate</Link> }, 'Kubernetes manifest Dekorators for the JVM'],
    [{ title: <Link to="#">Dependency Analysis</Link> }, 'Dependency Analysis - Analise project dependencies.'],
    [
      { title: <Link to="#">DNS Demo for NCL-5320</Link> },
      'Example Project for Newcastle Demo, basically copied from Project Newcastle Demo Project 1(http://localhost:9000/#/projects/100)',
    ],
    [{ title: <Link to="#">scala/scala</Link> }, 'The Scala programming language'],
    [
      { title: <Link to="#">opendistro-for-elasticsearch/security</Link> },
      'Open Distro for Elasticsearch Security is an Elasticsearch plugin that offers encryption, authentication, and authorization. When combined with Open Distro for Elasticsearch Security-Advanced Modules, it supports authentication via Active Directory, LDAP, Kerberos, JSON web tokens, SAML, OpenID and more. It includes fine grained role-based access control to indices, documents and fields. It also provides multi-tenancy support in Kibana.',
    ],
    [{ title: <Link to="#">Pnc Build Agent</Link> }, 'Pnc Build Agent - remote client to execute commands.'],
  ];

  return (
    <>
      <Table aria-label="Projects List" variant="compact" borders={true} cells={columns} rows={rows}>
        <TableHeader />
        <TableBody />
      </Table>
    </>
  );
};
