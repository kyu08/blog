import Image from 'next/image'
import React, { createElement } from 'react'

type PostImageFunc = (id: string) => React.FC<JSX.IntrinsicElements['img']>

const PostImage: PostImageFunc = (id) => (props) => {
  try {
    const { src, alt, title } = props
    // TODO: path joinで書き直す
    const imagePath = '../../' + "temp_posts/" + id + '/' + src // FIXME: 一時的に変更しているので後で戻す
    // const imagePath = "images/test.jpg"
    console.table({ imagePath })
    // const image = require(imagePath).default
    // const image = require('../../posts/' + id + '/' + src).default
    // const absPath = "/temp_posts/" + id + '/' + src
    const image = require(imagePath).default

    return <Image
      src={image}
      // src={require('../../temp_posts/nuphy/test2.jpg')}
      alt={alt as string}
      title={title}
      height={100}
      width={100}
    />

  } catch (e) {
    return createElement('img', props)
  }
}
export default PostImage
