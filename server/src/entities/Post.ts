import { Exclude, Expose } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { makeId, slugify } from '../helper/helper';
import Comment from './Comment';
import BaseEntity from './Entity';
import Sub from './Sub';
import { User } from './User';
import Vote from './Vote';

export default class Post extends BaseEntity {
  @Index()
  @Column()
  identifier: string;

  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: 'text' })
  body: string;

  @Column()
  subname: string;

  @Column()
  username: string;

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'usernmae' })
  user: User;

  @ManyToOne(() => Sub, sub => sub.posts)
  @JoinColumn({ name: 'subname', referencedColumnName: 'name' })
  sub: Sub;

  @Exclude()
  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @Exclude()
  @OneToMany(() => Vote, vote => vote.post)
  votes: Vote[];

  @Expose() get url(): string {
    return `r/${this.subname}/${this.identifier}/${this.slug}`;
  }

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((memo, curt) => memo + (curt.value || 0), 0);
  }

  protected userVote: number;

  setUserVote(user: User) {
    const index = this.votes?.findIndex(v => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    //makeId, slugify 함수는 helper.ts 파일에 정의됨
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
