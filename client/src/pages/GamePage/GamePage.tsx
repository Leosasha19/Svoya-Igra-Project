import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.ts';
import { getQuestionsData, selectAllQuestions } from '../../features/questionsDataSlice.ts';
import { useEffect, useState } from 'react';
import { resetUser, selectUserData } from '../../features/usersDataSlice.ts';
import {
  completeQuestion,
  resetGameProgress,
  saveProgress,
  SaveProgressPayload,
  selectGameProgress,
  selectGameQuestionStatus,
} from '../../features/gameProgressSlice.ts';
import { Question } from '../../types';
import './GamePage.scss';


function GamePage() {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [inputAnswerValue, setInputAnswerValue] = useState('');
  const [trueAnswer, setTrueAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const allQuestionsData = useAppSelector(selectAllQuestions);
  const player = useAppSelector(selectUserData);
  const questionStatus = useAppSelector(selectGameQuestionStatus);
  const gameProgress = useAppSelector(selectGameProgress);
  const psKeys = Object.keys(player.questionStatus ?? {});
  const qsKeys = Object.keys(questionStatus ?? {});

  const questionStatusToUse =
    psKeys.length > 0 && psKeys.length > qsKeys.length
      ? player.questionStatus
      : questionStatus;

  const exitHandler = () => {
    navigate('/');
    setScore(0);
    setSelectedQuestion(null);
    dispatch(resetGameProgress());
    dispatch(resetUser());
  };

  const handleCellClick = (question: Question) => {
    if (gameProgress.completedQuestions.includes(question.id)) {
      return;
    }
    setSelectedQuestion(question);
  };

  const updatePlayerScore = async (_playerName: string, score: number, completedQuestions: number[], questionStatus: SaveProgressPayload['questionStatus']) => {
    try {
      if (player && player.id !== null && player.name) {
        await dispatch(saveProgress({
          playerId: player.id,
          score: score,
          completedQuestions: completedQuestions,
          questionStatus: questionStatus,
        }));
      } else {
        console.error('Player data is not available.');
      }
    } catch (error) {
      console.error('Ошибка при обновлении счета:', error);
    }
  };

  const checkAnswer = () => {
    if (!selectedQuestion) {
      console.error('Нет выбранного вопроса');
      return;
    }
    const trueAnswer = selectedQuestion.answer.toLowerCase();
    const enteredAnswer = inputAnswerValue.toLowerCase();
    const isCorrect = trueAnswer === enteredAnswer;

    setTrueAnswer(isCorrect ? 'ПРАВИЛЬНО' : 'НЕ ПРАВИЛЬНО');
    if (isCorrect) {
      const newScore = score + selectedQuestion.points;
      setScore(newScore);
      dispatch(completeQuestion({ questionId: selectedQuestion.id, isCorrect, newScore }));
      updatePlayerScore(
        player.name,
        newScore,
        [...gameProgress.completedQuestions, selectedQuestion.id],
        {
          ...gameProgress.questionStatus,
          [selectedQuestion.id]: isCorrect ? 'correct' : 'wrong',
        },
      ).catch(error => console.error('Ошибка при обновлении игрока:', error));
    } else if (!isCorrect) {
      const newScore = gameProgress.score;
      dispatch(completeQuestion({ questionId: selectedQuestion.id, isCorrect, newScore }));
      updatePlayerScore(
        player.name,
        newScore,
        [...gameProgress.completedQuestions, selectedQuestion.id],
        {
          ...gameProgress.questionStatus,
          [selectedQuestion.id]: isCorrect ? 'correct' : 'wrong',
        },
      ).catch(error => console.error('Ошибка при обновлении игрока:', error));
    }

    setTimeout(() => {
      setSelectedQuestion(null);
      setTrueAnswer(null);
      setInputAnswerValue('');
    }, 2000);
  };

  useEffect(() => {
    dispatch(getQuestionsData());
    setScore(player.score);
    if (player && player.questionStatus) {
      const newQuestionsStatus = Object.entries(player.questionStatus);
      newQuestionsStatus.forEach(([questionId, status]) => {
        dispatch(completeQuestion({
          questionId: Number(questionId),
          isCorrect: status === 'correct',
          newScore: player.score,
        }));
      });
    }
  }, [player, dispatch]);

  return (
    <>
      <div className={'main_container'}>
        <div className={'main_container__topLine'}>
          <div className={'main_container__topLine__score'}>Баллы: {score}</div>
          <button
            onClick={exitHandler}
            className={'main_container__topLine__exit'}>ВЫХОД
          </button>
        </div>
        {selectedQuestion && (
          <>
            <div className="modal-overlay" onClick={() => setSelectedQuestion(null)}></div>
            <div className={'main_container__question'}>
              <div>{selectedQuestion.text}</div>
              {trueAnswer === null ? (
                <div>
                  <input
                    onChange={(event) => setInputAnswerValue(event.target.value)}
                    className={'main_container__question__input-answer'}
                    type="text" placeholder={'Ответ...'} />
                  <button
                    className={'main_container__question__button-answer'}
                    onClick={checkAnswer}
                  >OK
                  </button>
                </div>
              ) : (
                <div
                  className={trueAnswer === 'ПРАВИЛЬНО' ? 'main_container__question__result-true' : 'main_container__question__result-false'}>
                  {trueAnswer}
                </div>
              )}
            </div>
          </>
        )}

        <div className={'main_container__game-table'}>
          <div className={'main_container__game-table__header'}>
            {
              allQuestionsData && allQuestionsData.length > 0 ? (
                [...new Set(allQuestionsData.map((item) => item.category))].map((item, index) => (
                  <div
                    key={index}
                    className={'main_container__game-table__header__category'}>
                    {item}
                  </div>
                ))) : <div>LOADING</div>}
          </div>
          <div className={'table-body'}>
            {allQuestionsData && allQuestionsData.length > 0 ? (
              allQuestionsData.map((item, index) => (
                <div key={index} className={'table-row'}>
                  <div
                    onClick={() => handleCellClick(item)}
                    className={`table-cell 
                                    ${selectedQuestion?.id === item.id ? 'active' : ''}
                                    ${gameProgress.completedQuestions.includes(item.id) ?
                      questionStatusToUse && questionStatusToUse[item.id] === 'correct'
                        ? 'answered-correct'
                        : questionStatusToUse && questionStatusToUse[item.id] === 'wrong'
                          ? 'answered-wrong'
                          : ''
                      : ''
                    }`}>
                    {item.points}
                  </div>
                </div>
              ))
            ) : (
              <div>NO DATA</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GamePage;