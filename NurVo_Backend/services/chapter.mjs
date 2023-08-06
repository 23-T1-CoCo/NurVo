import { getTopic, getChapter } from "../db/db.mjs";


//chapter와 topic을 매칭
/*
예시
[{topic : {id: "", name: ""}, chapter : [{name: "", description: ""}, ....] }
 {topic : {}, chapter: [{}]}, .... }]
*/
export async function ChapterByTopic()  {
  const topic = await getTopic();
  const chapter = await getChapter();
  chapter.sort((a, b) => a.id - b.id);
  const result = [];
  topic.forEach((topic) => {
    const chapterByTopic = chapter.filter((chapter) => chapter.topic_id === topic.id);
    result.push({topic: topic, chapter: chapterByTopic});
  });
  return result;
};

export async function ChapterById(chapter_id) {
  const chapter = await getChapter();
  const chapterById = chapter.filter((chapter) => chapter.id === parseInt(chapter_id));
  return chapterById;
}