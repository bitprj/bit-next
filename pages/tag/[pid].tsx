import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";
import styled from 'styled-components';
import Twemoji from 'react-twemoji';
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";

import TagView from "../../components/home/TagView";
import Tags from "../../components/home/Tags";
import { Affix } from 'antd';

export default replaceMe;