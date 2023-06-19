import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import BaseEntity from './Entity';
import { Exclude, Expose } from 'class-transformer';
import Post from './Post';
import { User } from './User';
import Vote from './Vote';
import { makeId } from '../helper/helper';

@Entity('comments')
export default class Comment extends BaseEntity {
  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column()
  postId: number;

  @ManyToOne(() => Post, post => post.comments, { nullable: false })
  post: Post;

  @Exclude()
  @OneToMany(() => Vote, vote => vote.comment)
  votes: Vote[];

  protected userVote: number;

  //findIndex 함수를 사용
  //일치하는 값이 없다면 findIndex는 -1값을 리턴함
  setUserVotes(user: User) {
    const index = this.votes?.findIndex(
      vote => vote.username === user.username
    );
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  //reduce 함수를 이용해 point 결과값을 합쳐줌
  @Expose() get voteScore(): number {
    const initialValue = 0;
    return this.votes?.reduce(
      (previousValue, currentObject) =>
        previousValue + (currentObject.value || 0),
      initialValue
    );
  }

  @BeforeInsert()
  makeId() {
    this.identifier = makeId(8);
  }
}
